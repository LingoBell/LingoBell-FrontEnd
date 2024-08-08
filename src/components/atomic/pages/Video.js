import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import io from "socket.io-client";
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { Canvas } from '@react-three/fiber';
import ThreeScene from '../../../3Dmask/Model';
import { createFaceLandmark } from '../../../apis/FaceAPI';

const Wrap = styled.div`
    display: flex;
    align-items: center;
    background-color: #666;
    > video {
        width: 50%;
        height: 50vh;
        object-fit: contain;
        border-radius: 8px;
    }
    @media screen and (min-width: 1024px) {
        flex-direction: column;
        background-color: transparent;
        flex: 1;
        > video {
            width: 100%;
            height: 50%;
        }
    }
`
const socket = io('')
let pc1 = new RTCPeerConnection()
let pc = null
let isCaller = false

const VideoContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const CanvasStyled = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 5;
`;

const Video = forwardRef((props, ref) => {
    const params = useParams()
    const {
        notifyDiscon,
        onAudioStatusChange,
        onVideoStatusChange
    } = props
    const {
        roomName,
    } = params
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null)
    // const [peerConnection, setPeerConnection] = useState(null)
    const peerConnection = useRef(null)
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [faceLandmarker, setFaceLandmarker] = useState(null);
    const [faceData, setFaceData] = useState(null);
    const canvasRef = useRef(null);

    const initFaceLandmarker = async () => {
        const filesetResolver = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
        );
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: "CPU"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        });
        setFaceLandmarker(landmarker);
    }

    const init = async () => {
        console.log('init start');
        await initFaceLandmarker();
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            // audio: true,
        })
        localVideoRef.current.srcObject = stream;
        stream.getAudioTracks().enabled = isAudioEnabled;
        stream.getVideoTracks().enabled = isVideoEnabled;
        setLocalStream(stream);

        // console.log('스트림 ',stream);
        // console.log('비디오', stream.getVideoTracks())
        // console.log('오디오', stream.getAudioTracks())

        pc = new RTCPeerConnection()
        console.log('pc done')
        pc.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('CANDIDATE', event.candidate)
            }
        }
        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0]
        }

        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream)
        })
        socket.on('CREATED', async () => {
            console.log('CREATED')
            isCaller = true
        })
        socket.on('JOINED', async () => {
            console.log('JOINED')
            isCaller = false
        })
        socket.on('READY', async () => {
            console.log('READY')
            if (isCaller) {
                console.log('A. creating OFFER')
                const offer = await pc.createOffer();
                await pc.setLocalDescription(new RTCSessionDescription(offer));
                socket.emit('OFFER', offer);
            }
        })
        socket.on('ANSWER_RECEIVED', async (answer) => {
            console.log('ANSWER_RECEIVED')
            await pc.setRemoteDescription(new RTCSessionDescription(answer))

        })
        socket.on('OFFER_RECEIVED', async (offer) => {
            console.log('OFFER_RECEIVED')
            await pc.setRemoteDescription(new RTCSessionDescription(offer))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(new RTCSessionDescription(answer))
            console.log('emit answer')
            socket.emit('ANSWER', answer)
        })

        socket.on('CANDIDATE_RECEIVED', async (candidate) => {
            console.log('CANDIDATE_RECEIVED')
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
        })

        socket.on('OPP_DISCONNECTED', async () => {
            console.log('OPP_DISCON')
            isCaller = true
            if (pc) {

                // pc.setRemoteDescription(null)
                pc.close()
                pc = null
            }
            init()

            // notifyDiscon()
        })

        socket.emit('CREATE_OR_JOIN', roomName)
    }

    useEffect(() => {
        init()

        return () => {
            if (socket) {
                socket.close()
            }
            console.log('closing')
            if (pc) {

                // pc.setRemoteDescription(null)
                pc.close()
                pc = null
            }

        }
    }, [roomName])

    useEffect(() => {
        onAudioStatusChange(isAudioEnabled);
    }, [isAudioEnabled]);

    useEffect(() => {
        onVideoStatusChange(isVideoEnabled);
    }, [isVideoEnabled]);

    useImperativeHandle(ref, () => ({
        turnAudio() {
            if (localStream) {
                const enabled = !isAudioEnabled;
                localStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
                setIsAudioEnabled(enabled);
            }
        },
        turnVideo() {
            if (localStream) {
                const enabled = !isVideoEnabled;
                localStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
                setIsVideoEnabled(enabled);
            }
        },
    }));

    useEffect(() => {
        if (faceLandmarker && localVideoRef.current) {
            const video = localVideoRef.current;

            video.addEventListener('loadedmetadata', () => {
                // const canvasElement = document.createElement('canvas');
                // canvasElement.width = video.videoWidth;
                // canvasElement.height = video.videoHeight;
                // canvasElement.style.position = 'absolute';
                // canvasElement.style.top = '0';
                // canvasElement.style.left = '0';
                // canvasElement.style.pointerEvents = 'none';
                // document.body.appendChild(canvasElement);
                const canvas = canvasRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const canvasCtx = canvas.getContext('2d');
                const drawingUtils = new DrawingUtils(canvasCtx);

                const predictWebcam = async () => {
                    if (!video.videoWidth || !video.videoHeight) {
                        return;
                    }

                        const results = await faceLandmarker.detectForVideo(video, performance.now());

                        setFaceData(results.faceLandmarks[0]);
                        console.log('아ㅏ아아아ㅏ아아아아아아ㅏㅏㅏ', results.faceLandmarks[0]);
                        // await createFaceLandmark(results.faceLandmarks[0]);

                        if (results.faceLandmarks) {
                            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                            for (const landmarks of results.faceLandmarks) {
                                drawingUtils.drawConnectors(
                                    landmarks,
                                    FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                                    { color: "#C0C0C070", lineWidth: 1 }
                                );
                                drawingUtils.drawConnectors(
                                    landmarks,
                                    FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
                                    { color: "#FF3030" }
                                );
                                drawingUtils.drawConnectors(
                                    landmarks,
                                    FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
                                    { color: "#FF3030" }
                                );
                                drawingUtils.drawConnectors(
                                    landmarks,
                                    FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
                                    { color: "#30FF30" }
                                );
                                drawingUtils.drawConnectors(
                                    landmarks,
                                    FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
                                    { color: "#30FF30" }
                                );
                                drawingUtils.drawConnectors(
                                    landmarks,
                                    FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
                                    { color: "#E0E0E0" }
                                );
                                drawingUtils.drawConnectors(
                                    landmarks,
                                    FaceLandmarker.FACE_LANDMARKS_LIPS,
                                    { color: "#E0E0E0" }
                                );
                                drawingUtils.drawConnectors(
                                    landmarks,
                                    FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
                                    { color: "#FF3030" }
                                );
                                drawingUtils.drawConnectors(
                                    landmarks,
                                    FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
                                    { color: "#30FF30" }
                                );
                            }
                        }
                        requestAnimationFrame(predictWebcam);
                    };

                    // if (faceLandmarker) {
                    //     const results = await faceLandmarker.detectForVideo(localVideoRef.current, performance.now());

                    //     // if (results.faceLandmarks.length > 0) {
                    //     //     socket.emit('LANDMARKS_DATA', results.faceLandmarks[0]);

                    //     //     canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                    //     //     results.faceLandmarks.forEach(landmarks => {
                    //     //         drawingUtils.drawConnectors(
                    //     //             landmarks,
                    //     //             FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                    //     //             { color: '#C0C0C070', lineWidth: 1 }
                    //     //         );
                    //     //         drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#FF3030' });
                    //     //         drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: '#30FF30' });
                    //     //         drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: '#E0E0E0' });
                    //     //         drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: '#E0E0E0' });
                    //     //     });
                    //     // }

                    //     if (results.faceLandmarks.length > 0) {
                    //         const faceData = results.faceLandmarks[0];
                    //         try {
                    //           const overlayImage = await createFaceLandmark(faceData);
                    //           console.log('백에서 받음', overlayImage);

                    //           const image = new Image();
                    //           image.src = `data:image/jpeg;base64,${overlayImage}`;
                    //           image.onload = () => {
                    //             canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                    //             canvasCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    //           };
                    //         } catch (error) {
                    //           console.error('Error in creating face landmark:', error);
                    //         }
                    //       }
                    // }
                //     requestAnimationFrame(predictWebcam);
                // };

                predictWebcam();
            });
        }
    }, [faceLandmarker]);

    // console.log('ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ', faceData);

    return (
        <VideoContainer>
            <video ref={localVideoRef} playsInline id="left_cam" controls preload="metadata" autoPlay></video>
            <CanvasStyled ref={canvasRef} />
            <video ref={remoteVideoRef} playsInline id="right_cam" controls preload="metadata" autoPlay></video>
            {/* <ThreeScene /> */}
        </VideoContainer>
        <Wrap>
            <video ref={localVideoRef} playsInline id="left_cam" controls={false} preload="metadata" autoPlay></video>
            <video ref={remoteVideoRef} playsInline id="right_cam" controls={false} preload="metadata" autoPlay></video>
        </Wrap>
    );
});
export default Video;