import { current } from '@reduxjs/toolkit';
import { useState, useRef, useEffect, useCallback } from 'react';

const useSTT = (userId, chatRoomId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState([]);
  const [translation, setTranslation] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState('Undefined');
  const [processingTime, setProcessingTime] = useState('Undefined');
  const [error, setError] = useState(null);

  const websocketRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);

  const connectWebsocket = useCallback(() => {
    websocketRef.current = new WebSocket(`wss://socket.lingobell.xyz`);
    websocketRef.current.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connection established");
      websocketRef.current.send(JSON.stringify({
        type: 'config',
        userId: userId,
        chatRoomId: chatRoomId
      }))
    };
    websocketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    websocketRef.current.onmessage = (event) => {
      const transcriptData = JSON.parse(event.data);
      console.log("Parsed transcript data:", transcriptData);
      updateTranscription(transcriptData.user_id, transcriptData.text, transcriptData.translated_message, transcriptData.messageTime);
    };
  }, [userId, chatRoomId]);

  function getKSTCurrentTime() {
    const currentUTCDate = new Date();
    currentUTCDate.setHours(currentUTCDate.getHours() + 9);
    return currentUTCDate.toISOString();
  }

  function updateTranscription(userId, stt, translation, messageTime) {
    if (messageTime) {
      const formattedMessageTime = new Date(messageTime);
      console.log("Formatted messageTime:", formattedMessageTime.toISOString());
      
      setTranscription(prev => [
        ...prev,
        [{ word: stt, translation: translation, userId, messageTime: formattedMessageTime.toISOString() }],
      ]);
    } else {
      setTranscription(prev => [
        ...prev,
        [{ word: stt, translation: translation, userId, messageTime: getKSTCurrentTime() }],
      ]);
    }
  }
  
  const startRecording = useCallback(async () => {
    setError(null);
    audioContextRef.current = new AudioContext();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          autoGainControl: false,
          noiseSuppression: true,
          latency: 0
        }
      });
      streamRef.current = stream;

      await audioContextRef.current.audioWorklet.addModule('/realtime-audio-processor.js');
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = new AudioWorkletNode(audioContextRef.current, 'realtime-audio-processor');

      processor.port.onmessage = (event) => {
        processAudio(event.data);
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      setIsRecording(true);
    } catch (error) {
        console.error('Error starting recording:', error);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setError('마이크 접근 권한이 거부되었습니다. 브라우저 설정에서 마이크 접근을 허용해주세요.');
        } else if (error.name === 'NotFoundError') {
          setError('마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.');
        } else {
          setError(`녹음을 시작하는 중 오류가 발생했습니다: ${error.message}`);
        }
      }
  }, []);

  const stopRecording = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
  }, []);

  const processAudio = useCallback((sampleData) => {
    const outputSampleRate = 16000;
    const decreaseResultBuffer = decreaseSampleRate(sampleData, audioContextRef.current.sampleRate, outputSampleRate);
    const audioData = convertFloat32ToInt16(decreaseResultBuffer);

    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(audioData);
    }
  }, []);

  const decreaseSampleRate = (buffer, inputSampleRate, outputSampleRate) => {
    if (inputSampleRate === outputSampleRate) {
      return buffer;
    }
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const index = Math.round(i * sampleRateRatio);
      result[i] = buffer[index];
    }
    return result;
  };

  const convertFloat32ToInt16 = (buffer) => {
    const l = buffer.length;
    const buf = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      buf[i] = Math.min(1, buffer[i]) * 0x7FFF;
    }
    return buf.buffer;
  };

  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    isRecording,
    transcription,
    translation,
    detectedLanguage,
    processingTime,
    error,
    connectWebsocket,
    startRecording,
    stopRecording,
    websocketRef
  };
};

export default useSTT;
