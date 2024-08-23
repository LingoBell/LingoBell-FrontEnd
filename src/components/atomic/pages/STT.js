import React, { useState, useRef, useEffect } from 'react';

const STT = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState('Undefined');
  const [processingTime, setProcessingTime] = useState('Undefined');
  const [error, setError] = useState(null);


  const websocketRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);

  const connectWebsocket = () => {
    websocketRef.current = new WebSocket('ws://localhost:8765');
    websocketRef.current.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    };
    websocketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };
    websocketRef.current.onmessage = (event) => {
      console.log("Message from server:", event.data);
      const transcriptData = JSON.parse(event.data);
      updateTranscription(transcriptData);
    };
  };

  const updateTranscription = (transcriptData) => {
    if (Array.isArray(transcriptData.words) && transcriptData.words.length > 0) {
      setTranscription(prev => [...prev, transcriptData.words]);
    } else if (transcriptData.text) {
      setTranscription(prev => [...prev, [{ word: transcriptData.text, probability: 1 }]]);
    }

    if (transcriptData.language && transcriptData.language_probability) {
      setDetectedLanguage(`${transcriptData.language} (${transcriptData.language_probability.toFixed(2)})`);
    }

    if (transcriptData.processing_time) {
      setProcessingTime(`Processing time: ${transcriptData.processing_time.toFixed(2)} seconds`);
    }
  };

  const startRecording = async () => {
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
  };

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
  };

  const processAudio = (sampleData) => {
    const outputSampleRate = 16000;
    const decreaseResultBuffer = decreaseSampleRate(sampleData, audioContextRef.current.sampleRate, outputSampleRate);
    const audioData = convertFloat32ToInt16(decreaseResultBuffer);

    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(audioData);
    }
  };

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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Transcribe a Web Audio Stream with Huggingface VAD + Whisper</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={connectWebsocket} disabled={isConnected}>Connect</button>
        <button onClick={startRecording} disabled={!isConnected || isRecording}>Start Streaming</button>
        <button onClick={stopRecording} disabled={!isRecording}>Stop Streaming</button>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px', marginBottom: '20px' }}>
        {transcription.map((sentence, index) => (
          <p key={index}>
            {sentence.map((word, wordIndex) => (
              <span
                key={wordIndex}
                style={{
                  color: word.probability > 0.9 ? 'green' : word.probability > 0.6 ? 'orange' : 'red'
                }}
              >
                {word.word}{' '}
              </span>
            ))}
          </p>
        ))}
      </div>
      <div>WebSocket: {isConnected ? 'Connected' : 'Not Connected'}</div>
      <div>Detected Language: {detectedLanguage}</div>
      <div>Last Processing Time: {processingTime}</div>
    </div>
  );
};

export default STT;