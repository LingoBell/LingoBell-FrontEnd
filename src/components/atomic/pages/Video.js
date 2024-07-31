import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components'
import io from "socket.io-client";
export default props => {
    const params = useParams()
    const {
        roomName
    } = params
    const socket = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const streamRef = useRef(null)
    const remoteStreamRef = useRef(new MediaStream())
    let isInitiator = useRef(false);
    let isChannelReady = false; // 1. 방이 성립되었음을 의미 하는 것으로 보임
    let localStream; // 2. localStream까지 생성
    let isStarted = false; // 3. peerConnection이 생성되었음을 의미하는 것으로 보임
    let pc;
    let remoteStream;

    const peerConnection = useRef()
    const dataChannel = useRef()
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
    const createConnection = () => {
        console.log('1. create connection')
        
        console.log(peerConnection.current)
        peerConnection.current = new RTCPeerConnection(pcConfig)
        console.log(JSON.stringify(peerConnection.current, 0, 2))
        peerConnection.current.onicecandidate = event => {
            // console.log('iddddkdkdkdkdk', event)
            if (event.candidate) {
                socket.current.emit('CANDIDATE', event.candidate)
            }
        }

        // if (peerConnection.current.addTrack !== undefined) {
        console.log('3. addddddtrack', JSON.stringify(peerConnection.current, 0, 2))
        peerConnection.current.ontrack = (event) => {
            console.log('pc added stream')
            const remoteStream = event.streams;
            remoteStream[0].getTracks().forEach(track => {
                console.log('trasskskssksksksksk k  k ksks ks k : ')
                remoteStreamRef.current.addTrack(track)
            })
            
            // console.log(remoteStream)
            // if (remoteVideoRef.current) {
            //     remoteVideoRef.current.srcObject = event.streams[0];;
            // }
            // remoteVideoRef.current.srcObject = stream;
            // remoteVideoRef.current.play();
        };
        // } else {
        //     peerConnection.current.onaddstream = (event) => {
        //         console.log('pc added strea2m', peerConnection.current)
        //         const remoteStream = event.stream;
        //         // if (remoteVideoRef.current) {
        //             remoteStreamRef.current.addTrack(remoteStream);
        //         // }
        //         // remoteVideoRef.current.srcObject = stream;
        //         // remoteVideoRef.current.play();
        //     };
        // }
            
        
        peerConnection.current.ondatachannel = (event) =>{
            console.log("on data channel")
            let receiveChannel = event.channel;
            // receiveChannel.onopen = handleDataChannelOpen;
            receiveChannel.onmessage = (event) => {
                console.log('face data')
                const faceData = JSON.parse(event.data)
                console.log(faceData)
            }
            // receiveChannel.onerror = handleDataChannelError;
        
        };
        peerConnection.current.oniceconnectionstatechange = () => {
            console.log('ICE Connection State:', peerConnection.current.iceConnectionState);
        };
        
        peerConnection.current.onconnectionstatechange = () => {
            console.log('Connection State:', peerConnection.current.connectionState);
        };
        
        peerConnection.current.onicecandidateerror = (event) => {
            console.error('ICE Candidate Error:', event);
        };
        function sendMessage(message) {
            console.log('Client sending message: ', message);
            socket.current.emit('message', message);
        }
        // dataChannel
        // dataChannel.current = peerConnection.current.createDataChannel('faceDataChannel')
        // dataChannel.current.onopen = () => {
        //     console.log('data channel opened')
        // }
        // dataChannel.current.onmessage = (event) => {
        //     console.log('face data')
        //     const faceData = JSON.parse(event.data)
        //     console.log(faceData)
        // }

        
        addTrackToPc()
        // streamRef.current.getTracks().forEach(track => {

        //     console.log('track : ')
        //     console.log(track)
        //     peerConnection.current.addTrack(track, streamRef.current)
            
        // });
        /* The code provided is a comment block in JavaScript. It appears to be a comment section that
        includes a function name `addTrackToPc()`. The code itself does not contain any actual
        implementation or functionality, it is just a comment. */
        // addTrackToPc()
        console.log('create connection done')
    }
    // const setupVideo = async () => {
        
    //     // streamRef.current.getTracks().forEach(track => {

    //     //     console.log('track : ')
    //     //     console.log(track)
    //     //     if (peerConnection.current) {
    //     //         // addTrackToPc()
    //     //         peerConnection.current.addTrack(track, streamRef.current)
    //     //     }
            
    //     // });
    // }

    const addTrackToPc = async () => {
        console.log('5. add track to pc finally');
        try {
            // getUserMedia를 호출하여 비디오 스트림을 가져옴
            streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log('Local stream:', streamRef.current);
            console.log('Peer connection state:', peerConnection.current?.connectionState);
    
            // peerConnection이 초기화된 상태이고 닫혀 있지 않은 경우에만 트랙 추가
            if (streamRef.current && peerConnection.current && peerConnection.current.connectionState !== 'closed') {
                console.log('6. Adding local tracks to peer connection');
                const tracks = streamRef.current.getTracks();
                console.log('Local tracks:', tracks);
                
                tracks.forEach(track => {
                    console.log('Adding track:', track);
                    peerConnection.current.addTrack(track, streamRef.current);
                });
    
                // 로컬 비디오 요소에 스트림 설정
                localVideoRef.current.srcObject = streamRef.current;
                localVideoRef.current.onloadedmetadata = () => {
                    localVideoRef.current.play();
                    // detectFaces(localVideoRef.current); // 얼굴 감지 함수 호출 (필요 시)
                };
            } else {
                console.error('Peer connection is not initialized or already closed.');
            }
        } catch (error) {
            // 오류 발생 시 콘솔에 출력
            console.error('Error accessing media devices:', error);
        }
    };
    useEffect(() => {
        console.log('peer connection : ')
        console.log(peerConnection.current)
    }, [streamRef.current, peerConnection.current])
    useEffect(() => {
        socket.current = io.connect('https://4888-14-52-171-3.ngrok-free.app')
        createConnection()
        
        socket.current.emit('CREATE_OR_JOIN', roomName)

        socket.current.on('CREATED', (room) => {
            console.log('CREATED')
            isInitiator.current = true
        })
        socket.current.on('JOIN', async (room) => {
            console.log('A. JOIN')
            if (!peerConnection.current) {
                createConnection()
            }
            if (isInitiator.current) {
                const offer = await peerConnection.current.createOffer()
                console.log('B. EMIT OFFER')
                socket.current.emit('OFFER', offer)
                // setLocalAndSendMessage(offer)
                await peerConnection.current.setLocalDescription(offer)
            }
            // const offer = await peerConnection.current.createOffer()
            // socket.current.emit('OFFER', offer)
            // setLocalAndSendMessage(offer)
        })

        // socket.current.on('JOINED', async room => {
        //     console.log('A. JOINED')
        //     if (isInitiator.current) {
        //         const offer = await peerConnection.current.createOffer()
        //         console.log('B. EMIT OFFER')
        //         socket.current.emit('OFFER', offer)
        //         setLocalAndSendMessage(offer)
        //     }
        // })

        socket.current.on('OFFER_RECEIVED', async offer => {
            console.log('OFFER_RECEIVED')
            console.log(offer)
            // if (peerConnection.current.signalingState === "have-local-offer") {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))
            // }
            const answer = await peerConnection.current.createAnswer()
            await peerConnection.current.setLocalDescription(answer)
            socket.current.emit('ANSWER', answer)
        })

        socket.current.on('ANSWER_RECEIVED', async answer => {
            console.log('C. ANSWER_RECEIVED')
            console.log(answer)
            // if (peerConnection.current.signalingState === "have-local-offer") {
            // await peerConnection.current.setRemoteDescription(answer);
            // }
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
        })

        socket.current.on('CANDIDATE_RECEIVED', async message => {
            console.log('CANDIDATE_RECEIVED')
            console.log(message)
            var candidate = new RTCIceCandidate(message);
            console.log(peerConnection.current)
            peerConnection.current.addIceCandidate(candidate).catch(e => {
                console.log('added aice failed')
                console.error(e)
            });
            console.log('added icd candidate')
        })

        socket.current.on('OPP_DISCONNECTED', async () => {
            console.log('OPP_DISCONNECTED')
            // isInitiator = true
            // if (peerConnection.current) {
                /* `isInitiator = true` sets the variable `isInitiator` to `true`, indicating that the
                current user is the initiator of the connection. */
                isInitiator.current = true
                if (peerConnection.current) {
                    remoteStreamRef.current = new MediaStream()
                    console.log('2. closing')
        
                    peerConnection.current.close();
                    
                    console.log(peerConnection.current)
                    peerConnection.current = null;
                }
                setTimeout(() => {
                    createConnection()
                }, 100)
                
                // await peerConnection.current.setRemoteDescription(new RTCSessionDescription({
                //     type: 'rollback'
                //   }));
                // peerConnection.current.close();
                // peerConnection.current = new RTCPeerConnection(pcConfig)
            // }

        })
        // socket.current.on('connect')
        // function setLocalAndSendMessage(sessionDescription) {
            
        //     // pc.setLocalDescription(sessionDescription);
        //     // console.log('setLocalAndSendMessage sending message', sessionDescription);
        //     // sendMessage(sessionDescription);
        //     console.log('B. SESSION DESCRIPTION', sessionDescription);
            
        //     peerConnection.current.setLocalDescription(sessionDescription)

        // }
        // 얼굴 인식 및 좌표값 전송
        const detectFaces = async (video) => {
            // await window.faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            // await window.faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            // await window.faceapi.nets.faceRecognitionNet.loadFromUri('/models');

            setInterval(async () => {
                // const detections = await window.faceapi.detectAllFaces(video, new window.faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
                // if (detections.length > 0) {
                //     const faceData = detections.map(detection => ({
                //         x: detection.detection.box.x,
                //         y: detection.detection.box.y,
                //         width: detection.detection.box.width,
                //         height: detection.detection.box.height
                //     }));
                //     if (dataChannel.current && dataChannel.current.readyState === 'open') {
                //         console.log('data chaneeel send')
                //         dataChannel.current.send(JSON.stringify(faceData));
                //     }
                // }
            }, 100);
        };
        // const startVideo = async () => {
        //     streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
        //     localVideoRef.current.srcObject = streamRef.current;

        //     setupVideo()

        //     localVideoRef.current.onloadedmetadata = () => {
        //         localVideoRef.current.play();
        //         // detectFaces(localVideoRef.current);
        //     };
        // };
        
        
        // startVideo()
        // setupVideo()
        remoteVideoRef.current.srcObject = remoteStreamRef.current
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }

            // if (isStarted) {
            //     stop();
            // }
        };
    }, []);

    return (
        <>
            <video ref={localVideoRef} playsInline id="left_cam" controls preload="metadata" autoPlay></video>
            <video ref={remoteVideoRef} playsInline id="right_cam" controls preload="metadata" autoPlay></video>
        </>
    );
}