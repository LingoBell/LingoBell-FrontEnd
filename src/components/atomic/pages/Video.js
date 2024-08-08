import React, { useEffect } from 'react'
import styled from 'styled-components'
let socket = new WebSocket('ws://34.64.241.5:38080');
let mediaRecorder
export default props => {
    
    socket.onmessage = (event) => {
        console.log(message)
        const message = JSON.parse(event.data);
    };
    const init = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(1000); // Send audio data every second
    
        mediaRecorder.ondataavailable = (event) => {
            console.log('dodddkdk')
            console.log(event.data)
            console.log(socket.readyState)
            
            if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                console.log('snedddd')
                socket.send(event.data);
            }
        };
    
        mediaRecorder.onstop = () => {
            stream.getTracks().forEach(track => track.stop());
            socket.close();
        };
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div></div>
    )
}