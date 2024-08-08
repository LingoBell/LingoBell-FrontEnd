import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components'
import io from "socket.io-client";

const socket = io('')
let pc1 = new RTCPeerConnection()
let pc = null
let isCaller = false
let mediaRecorder
let audioStream
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
    
    const init = async () => {
        console.log('init start')
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
        audioStream = new MediaStream()
        stream.getAudioTracks().forEach(track => {
            audioStream.addTrack(track)
        })

        mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' })

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0 && socket.connected) {
                const reader = new FileReader();
                reader.readAsDataURL(event.data);
                reader.onloadend = () => {
                    // const base64data = reader.result;
                    console.log(reader.result)
                    const base64data = reader.result.split(',')[1]
                    
                    // console.log(base64data)
                    console.log('emit')
                    socket.emit('audio', base64data);
                };
            }
        }

        socket.on('transcription', data => {
            console.log(data)
        })

        mediaRecorder.start(1000)

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
            if (mediaRecorder) {
                mediaRecorder.close()
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
        <>
            <video ref={localVideoRef} playsInline id="left_cam" controls preload="metadata" autoPlay></video>
            <video ref={remoteVideoRef} playsInline id="right_cam" controls preload="metadata" autoPlay></video>
        </>
    );
});
export default Video;