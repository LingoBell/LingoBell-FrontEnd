import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components'
import io from "socket.io-client";

const socket = io('')
let pc1 = new RTCPeerConnection()
let pc = null
let isCaller = false
export default props => {
    const params = useParams()
    const {
        notifyDiscon
        
    } = props
    const {
        roomName,
    } = params
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null)
    // const [peerConnection, setPeerConnection] = useState(null)
    const peerConnection = useRef(null)
    
    const init = async () => {
        console.log('init start')
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        })
        localVideoRef.current.srcObject = stream
        setLocalStream(stream)

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
    }, [])

    return (
        <>
            <video ref={localVideoRef} playsInline id="left_cam" controls preload="metadata" autoPlay></video>
            <video ref={remoteVideoRef} playsInline id="right_cam" controls preload="metadata" autoPlay></video>
        </>
    );
}