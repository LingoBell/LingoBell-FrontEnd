import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import io from "socket.io-client";
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
import {
    TextureLoader,
    BufferGeometry,
    // sRGBEncoding,
    ShaderMaterial,
    DoubleSide,
    Mesh,
    Float32BufferAttribute,
} from 'three'
import defaultMaskImage from '../../../assets/images/hamzzi.png'
import action from '../../../assets/images/action.jpg'
import bono from '../../../assets/images/bono.png'
import ddung from '../../../assets/images/ddung.png'
import gaksital from '../../../assets/images/gaksital.png'
import jocker from '../../../assets/images/jocker.jpg'
// import axios from "axios";
// import { createFaceLandmark } from '../../../apis/FaceAPI';
import { send_notification, getMyProfile } from '../../../apis/UserAPI';
// import { log } from 'three/webgpu';
import { useSelector } from 'react-redux';
import useSTT from './STT';

const Wrap = styled.div`
    height : 100%;
    @media screen and (min-width : 600px) {
         position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media screen and (min-width: 1024px) {
        flex-direction: column;
        background-color: transparent;
        flex: 1;
        overflow : hidden;
       
    }
`
const VideoWrap = styled.div`
    width : 100%;
    height : 50%;
    position: relative;
        > video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }    
    @media screen and (min-width : 600px) {
        height : 100%;
        
        >video {
            width : 100%;
            height : 100%;
            min-height : 230px;
            border-radius : 8px;
        }        
    }

    @media screen and (min-width : 1024px) {
        height : 50%;

        > video {
            width: 100%;
            height: 100%;
        }
    }
`

const VideoWrap2 = styled.div`
    // display : flex;
    // flex-direction : column;
    // flex : 1;
    // width : 100%;
    // max-height : 90%;
    height : calc(100% - 93px);

    @media screen and (min-width : 600px) {
    display : flex;
    flex-direction : row;
    flex: 1;
    width : 100%;
    max-height : 240px;
    }

    @media screen and (min-width : 1024px) {
    display : flex;
    flex-direction : column;
    flex : 1;
    width : 100%;
    max-height : 100%;
    }
`

const socket = io(window.location.host.includes('lingobell.xyz') ? 'https://socket.lingobell.xyz' : "https://socket.localhost:8080")
let pc = null
let isCaller = false
const pcConfig = {
    'iceServers': [{
        urls: 'stun:stun.l.google.com:19302'
    },
    {
        urls: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com"
    }]
};

const ImageSelector = styled.select`
  display : none;
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 5px;
  font-size: 16px;
`;

function FaceMask({ faceData, videoWidth, videoHeight, maskImage }) {
    const meshRef = useRef();
    const { scene, camera } = useThree();

    const texture = useLoader(TextureLoader, maskImage);

    useEffect(() => {
        camera.left = -videoWidth / 2;
        camera.right = videoWidth / 2;
        camera.top = videoHeight / 2;
        camera.bottom = -videoHeight / 2;
        camera.near = 0.1;
        camera.far = 1000;
        camera.position.z = 500;
        camera.updateProjectionMatrix();
    }, [camera, videoWidth, videoHeight]);

    const geometry = useMemo(() => new BufferGeometry(), []);

    const material = useMemo(() => {
        // texture.encoding = sRGBEncoding;
        texture.anisotropy = 16;

        return new ShaderMaterial({
            uniforms: {
                map: { value: texture },
                opacity: { value: 1 },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                uniform float opacity;
                varying vec2 vUv;
                void main() {
                    vec4 texColor = texture2D(map, vUv);
                    gl_FragColor = vec4(texColor.rgb, texColor.a * opacity);
                }
            `,
            transparent: true,
            side: DoubleSide,
        });
    }, [texture]);

    useEffect(() => {
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);
        meshRef.current = mesh;

        return () => {
            scene.remove(mesh);
        };
    }, [scene, geometry, material]);

    useFrame(() => {
        if (faceData && meshRef.current) {
            const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
            const leftEye = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
            const rightEye = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
            const nose = [193, 122, 6, 351, 419, 456, 363, 360, 279, 358, 327, 326, 2, 97, 98];
            const mouth = [0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61, 185, 40, 39, 37];

            const featureGroups = [faceOval, leftEye, rightEye, nose, mouth];

            const positions = [];
            const indices = [];
            const uvs = [];

            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

            const addContour = (contour) => {
                const startIndex = positions.length / 3;
                contour.forEach((index) => {
                    const point = faceData[index];
                    const x = (point.x - 0.5) * videoWidth;
                    const y = (0.5 - point.y) * videoHeight;
                    const z = -point.z * 150;
                    positions.push(x, y, z);

                    minX = Math.min(minX, point.x);
                    maxX = Math.max(maxX, point.x);
                    minY = Math.min(minY, point.y);
                    maxY = Math.max(maxY, point.y);
                });

                for (let i = startIndex + 1; i < positions.length / 3 - 1; i++) {
                    indices.push(startIndex, i, i + 1);
                }
            };

            addContour(faceOval);
            featureGroups.forEach(addContour);

            const calculateUV = (x, y) => [
                (x - minX) / (maxX - minX),
                1 - (y - minY) / (maxY - minY)
            ];

            faceOval.forEach((index) => {
                const point = faceData[index];
                const [u, v] = calculateUV(point.x, point.y);
                uvs.push(u, v);
            });

            featureGroups.forEach(group => {
                group.forEach((index) => {
                    const point = faceData[index];
                    const [u, v] = calculateUV(point.x, point.y);
                    uvs.push(u, v);
                });
            });

            geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
            geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();

            meshRef.current.position.set(0, 0, 0);
            meshRef.current.scale.set(1.3, 1.3, 1.3);
        }
    });

    return null;
}

const Video = forwardRef((props, ref) => {
    const params = useParams()
    const {
        notifyDiscon,
        onAudioStatusChange,
        onVideoStatusChange,
        onConnectionChange,
        isMaskOn
    } = props

    const {
        isConnected,
        isRecording,
        transcription,
        detectedLanguage,
        processingTime,
        error,
        connectWebsocket,
        startRecording,
        stopRecording,
        websocketRef
    } = useSTT(userId, chatRoomId);

    const { chatId } = params
    const roomName = chatId;
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null)
    // const [peerConnection, setPeerConnection] = useState(null)
    const peerConnection = useRef(null)
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [faceLandmarker, setFaceLandmarker] = useState(null);
    const [faceData, setFaceData] = useState(null);
    const [remoteFaceData, setRemoteFaceData] = useState(null);
    const [isRemoteMaskOn, setIsRemoteMaskOn] = useState(true);
    // const [maskImage, setMaskImage] = useState(defaultMaskImage);
    const [localMaskImage, setLocalMaskImage] = useState(defaultMaskImage);
    const [remoteMaskImage, setRemoteMaskImage] = useState(defaultMaskImage);
    const canvasRef = useRef(null);
    const recorderRef = useRef(null); // GPU 서버 전달하기 위해
    const [responses, setResponses] = useState([]);
    const [nativeLanguage, setNativeLanguage] = useState(null);
    const [learningLanguages, setLearningLanguages] = useState([]);
    const user = useSelector(state => state.user);
    const [selectedImage, setSelectedImage] = useState("image1");
    const { chatId: chatRoomId } = useParams();
    const userId = user?.uid;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileData = await getMyProfile();
                setNativeLanguage(profileData.nativeLanguage);
                setLearningLanguages(profileData.learningLanguages);

                if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                    sendLanguageInfo();
                    console.log("useEffect안에서 fetchProfileData함수 실행 즉 sendLanguageInfo() 실행 완료");
                }

            } catch (error) {
                console.error("Failed to fetch profile data", error);
            }
        };
        fetchProfileData();
    }, []);

    const sendLanguageInfo = () => {
        const userInfo = {
            type: "language",
            userId: user.user.uid,
            nativeLanguage: nativeLanguage,
            learningLanguages: learningLanguages
        };

        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify(userInfo));
            console.log("WebSocket message sent:", JSON.stringify(userInfo));
        } else {
            console.log("WebSocket connection is not open to send language info.");
        }
    };

    const muteLocalAudioForMe = (stream) => {
        if (stream && stream.getAudioTracks().length > 0) {
            const audioTrack = stream.getAudioTracks()[0];
            audioTrack.enabled = false;

            setTimeout(() => {
                audioTrack.enabled = true;
            }, 10);
        }
    };

    const [availableImages] = useState({
        image1: defaultMaskImage,
        image2: action,
        image3: bono,
        image4: ddung,
        image5: gaksital,
        image6: jocker
    });

    const handleImageChange = (event) => {
        const selectedImage = availableImages[event.target.value];
        setLocalMaskImage(selectedImage);
        console.log('마스크 변경', event.target.value);
        socket.emit('MASK_CHANGED', { roomName, maskImage: event.target.value });
    };

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

    const sendLandmarksData = (landmarksData) => {
        socket.emit('LANDMARKS_DATA', { landmarksData, isMaskOn });
    };

    const init = async () => {
        console.log('init start');
        await initFaceLandmarker();
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })

        startRecording();

        localVideoRef.current.srcObject = stream;
        stream.getAudioTracks().enabled = isAudioEnabled;
        stream.getVideoTracks().enabled = isVideoEnabled;
        setLocalStream(stream);

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true;
        }

        pc = new RTCPeerConnection(pcConfig)
        console.log('pc done')
        pc.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('CANDIDATE', { candidate: event.candidate, roomName })
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
            await send_notification(chatId) // 상대방에게 notification pop up
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
                console.log('OFFER', offer)
                socket.emit('OFFER', { roomName, offer });
            }
        })
        socket.on('ANSWER_RECEIVED', async (answer) => {
            console.log('ANSWER_RECEIVED')
            await pc.setRemoteDescription(new RTCSessionDescription(answer))
            muteLocalAudioForMe(stream);
        })
        socket.on('OFFER_RECEIVED', async (offer) => {
            console.log('OFFER_RECEIVED')
            await pc.setRemoteDescription(new RTCSessionDescription(offer))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(new RTCSessionDescription(answer))
            console.log('emit answer')
            socket.emit('ANSWER', { roomName, answer })
            muteLocalAudioForMe(stream);
        })

        socket.on('CANDIDATE_RECEIVED', async (candidate) => {
            console.log('CANDIDATE_RECEIVED')
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
        })

        socket.on('LANDMARKS_DATA_RECEIVED', ({ landmarksData, isMaskOn }) => {
            setRemoteFaceData(landmarksData);
            setIsRemoteMaskOn(isMaskOn);
        });

        socket.on('MASK_CHANGED_RECEIVED', ({ maskImage }) => {
            setRemoteMaskImage(availableImages[maskImage]);
        });

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

        props.onConnectionChange(true);
    };

    const endCall = () => {
        console.log('Ending call...')
        if (pc) {
            pc.close();
            pc = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null)
        }
        if (socket) {
            socket.emit('DISCONNECTED', roomName);
            socket.close();
            props.onConnectionChange(false);
            // websocketRef.current.onclose;
            
        }
        
    };

    useEffect(() => {
        init();

        return () => {
            if (socket) {
                socket.emit('DISCONNECTED', roomName)
                socket.close()
                props.onConnectionChange(false);
            }
            console.log('closing')
            if (pc) {
                // pc.setRemoteDescription(null)
                pc.close()
                pc = null
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        }
    }, [roomName])

    useEffect(() => {
        if (faceData) {
            sendLandmarksData(faceData);
        }
    }, [faceData, isMaskOn]);

    useEffect(() => {
        onAudioStatusChange(isAudioEnabled);
        
        if (isAudioEnabled) {
            startRecording();
        } else {
            stopRecording();
        }
    }, [isAudioEnabled, websocketRef.current]);

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
        endCall() {
            endCall()
        },
        changeSelection(value) {
            // 옵션 변경을 위해 호출될 함수
            const selectedMask = availableImages[value];
            if (selectedMask) {
                setLocalMaskImage(selectedMask);
                setSelectedImage(selectedMask);
                console.log('마스크 변경', value);
                socket.emit('MASK_CHANGED', { roomName, maskImage: value });
            }
        },
    }));

    useEffect(() => {
        if (faceLandmarker && localVideoRef.current) {
            const video = localVideoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const canvasCtx = canvas.getContext('2d');
            canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const predictWebcam = async () => {
                if (!video.videoWidth || !video.videoHeight) {
                    return;
                }

                const results = await faceLandmarker.detectForVideo(video, performance.now());

                if (results.faceLandmarks && results.faceLandmarks[0]) {
                    setFaceData(results.faceLandmarks[0]);
                    // sendLandmarksData(results.faceLandmarks[0]);  // Send landmarks data to server
                }

                if (results.faceLandmarks) {
                    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                    for (const landmarks of results.faceLandmarks) {

                        const x = landmarks[0].x * canvas.width;
                        const y = landmarks[0].y * canvas.height;
                        const width = (landmarks[454].x - landmarks[234].x) * canvas.width;
                        const height = (landmarks[152].y - landmarks[10].y) * canvas.height;

                        // 이미지 로드
                        const img = new Image();
                        img.src = localMaskImage;
                        img.onload = function () {
                            // 이미지 그리기
                            canvasCtx.save();
                            canvasCtx.translate(x + width / 2, y + height / 2);
                            canvasCtx.rotate(Math.atan2(landmarks[454].y - landmarks[234].y, landmarks[454].x - landmarks[234].x));
                            canvasCtx.drawImage(img, -width / 2, -height / 2, width, height);
                            canvasCtx.restore();
                        };
                    }
                }
                requestAnimationFrame(predictWebcam);
            };
            video.addEventListener('loadedmetadata', predictWebcam);

            return () => {
                video.removeEventListener('loadedmetadata', predictWebcam);
            };
        }
    }, [faceLandmarker, localStream]);

    // 프레임을 캡처하여 서버로 전송
    // const captureFrameAndSend = async () => {
    //     if (!localVideoRef.current || !canvasRef.current) return;

    //     const video = localVideoRef.current;
    //     const canvas = canvasRef.current;
    //     canvas.width = video.videoWidth;
    //     canvas.height = video.videoHeight;

    //     const ctx = canvas.getContext('2d');
    //     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    //     // 이미지 데이터를 Blob으로 변환
    //     canvas.toBlob((blob) => {
    //         if (blob) {
    //             // Blob 데이터를 socket을 통해 서버로 전송
    //             socket.emit('FRAME_DATA', blob);
    //             console.log('프레임 소켓으로 전송중.......')
    //         }
    //     }, 'image/jpeg');
    // };

    // useEffect(() => {
    //     // 주기적으로 프레임을 캡처하고 전송 (예: 200ms 마다 전송)
    //     const intervalId = setInterval(() => {
    //         captureFrameAndSend();
    //     }, 200);

    //     return () => clearInterval(intervalId);
    // }, []);

    return (
        <Wrap>
            <VideoWrap2>
                <VideoWrap>
                    <video
                        style={{ backgroundColor: 'black' }}
                        ref={localVideoRef}
                        playsInline id="left_cam"
                        controls={false}
                        preload="metadata"
                        autoPlay></video>
                    {localMaskImage && faceData && isMaskOn && (
                        <Canvas
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: `100%`,
                                height: '100%',
                                pointerEvents: 'none',
                            }}
                            orthographic
                            camera={{ zoom: 1, position: [0, 0, 500] }}
                        >
                            <ambientLight intensity={0.4} />
                            <pointLight position={[0, 0, 500]} intensity={0.6} />
                            <directionalLight position={[0, 0, 500]} intensity={0.5} />
                            <FaceMask
                                faceData={faceData}
                                videoWidth={localVideoRef.current.videoWidth}
                                videoHeight={localVideoRef.current.videoHeight}
                                maskImage={localMaskImage}
                            />
                        </Canvas>
                    )}
                </VideoWrap>

                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div style={{ padding: '1px', height: '1%' }} />

                <VideoWrap>
                    <video
                        style={{ backgroundColor: 'black' }}
                        ref={remoteVideoRef}
                        playsInline id="right_cam"
                        controls={false}
                        preload="metadata"
                        autoPlay></video>
                    {remoteMaskImage && remoteFaceData && isRemoteMaskOn && (
                        <Canvas
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: `100%`,
                                height: '100%',
                                pointerEvents: 'none',
                            }}
                            orthographic
                            camera={{ zoom: 1, position: [0, 0, 500] }}
                        >
                            <ambientLight intensity={0.4} />
                            <pointLight position={[0, 0, 500]} intensity={0.6} />
                            <directionalLight position={[0, 0, 500]} intensity={0.5} />
                            <FaceMask
                                faceData={remoteFaceData}
                                videoWidth={remoteVideoRef.current ? remoteVideoRef.current.videoWidth : 360}
                                videoHeight={remoteVideoRef.current ? remoteVideoRef.current.videoHeight : 263}
                                maskImage={remoteMaskImage}
                            />
                        </Canvas>
                    )}
                </VideoWrap>
            </VideoWrap2>
            <ImageSelector onChange={handleImageChange} value={selectedImage}>
                <option value="image1">hamzzik</option>
                <option value="image2">action mask</option>
                <option value="image3">bono bono</option>
                <option value="image4">ddung e</option>
                <option value="image5">korea traditional mask</option>
                <option value="image6">jocker</option>
            </ImageSelector>
        </Wrap >
    );
});

export default Video;