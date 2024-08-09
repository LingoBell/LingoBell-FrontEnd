import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components'
import io from "socket.io-client";
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
const Video = forwardRef((props, ref) => {
    const params = useParams()
    const {
        notifyDiscon,
        onAudioStatusChange, 
        onVideoStatusChange
    } = props
    const {
        chatId: roomName,
    } = params

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null)
    // const [peerConnection, setPeerConnection] = useState(null)
    const peerConnection = useRef(null)
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    
    const init = async () => {
        console.log('init start')
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            // audio: true,
        })
        localVideoRef.current.srcObject = stream
        stream.getAudioTracks().enabled = isAudioEnabled;
        stream.getVideoTracks().enabled = isVideoEnabled;
        setLocalStream(stream)

        // console.log('스트림 ',stream);
        // console.log('비디오', stream.getVideoTracks())
        // console.log('오디오', stream.getAudioTracks())

        pc = new RTCPeerConnection()
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
                socket.emit('OFFER', { roomName, offer });
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
            socket.emit('ANSWER', {roomName, answer})
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
                socket.emit('DISCONNECTED', roomName)
                socket.close()
            }
            console.log('closing')
            if (pc) {
                
                // pc.setRemoteDescription(null)
                pc.close()
                pc = null
            }
            
        }
    }, [])

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
    }))

    return (
        <Wrap>
            <video ref={localVideoRef} playsInline id="left_cam" controls={false} preload="metadata" autoPlay></video>
            <video ref={remoteVideoRef} playsInline id="right_cam" controls={false} preload="metadata" autoPlay></video>
        </Wrap>
    );
});
export default Video;