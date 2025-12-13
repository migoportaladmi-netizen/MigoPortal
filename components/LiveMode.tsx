import React, { useEffect, useRef, useState } from 'react';
import { getGeminiClient } from '../services/gemini';
import { LiveServerMessage, Modality } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audio';
import { Mic, MicOff, Video, VideoOff, Power, Volume2, Maximize2 } from 'lucide-react';

const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';

const LiveMode: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const frameIntervalRef = useRef<number | null>(null);

  // Initialize Audio Contexts
  useEffect(() => {
    inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return () => {
        disconnect();
        inputContextRef.current?.close();
        audioContextRef.current?.close();
    };
  }, []);

  const connect = async () => {
    setStatus('connecting');
    setErrorMessage(null);

    try {
      const ai = getGeminiClient();
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: isVideoOn ? { width: 640, height: 480 } : false 
      });
      streamRef.current = stream;

      // Setup Video Preview
      if (videoRef.current && isVideoOn) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are Migo, a witty and observant AI companion. Keep responses concise and conversational.',
        },
        callbacks: {
          onopen: () => {
            console.log('Live session opened');
            setStatus('connected');
            setIsActive(true);
            setupAudioInput(stream);
            if (isVideoOn) setupVideoInput();
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
               await playAudioResponse(base64Audio);
            }
            
            if (message.serverContent?.interrupted) {
                // Clear audio queue
                sourcesRef.current.forEach(source => source.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            console.log('Session closed');
            setStatus('disconnected');
            setIsActive(false);
          },
          onerror: (err) => {
            console.error('Session error', err);
            setErrorMessage('Connection error. Please try again.');
            disconnect();
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Failed to connect:", err);
      setErrorMessage(err.message || "Failed to access media devices");
      setStatus('disconnected');
    }
  };

  const setupAudioInput = (stream: MediaStream) => {
    if (!inputContextRef.current) return;
    
    const source = inputContextRef.current.createMediaStreamSource(stream);
    const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
      if (!isMicOn) return; // Mute logic
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = createBlob(inputData);
      
      sessionPromiseRef.current?.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    source.connect(processor);
    processor.connect(inputContextRef.current.destination);
  };

  const setupVideoInput = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const interval = window.setInterval(() => {
        if (!isVideoOn || !videoRef.current || !ctx) return;
        
        canvasRef.current!.width = videoRef.current.videoWidth;
        canvasRef.current!.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        
        const base64Data = canvasRef.current!.toDataURL('image/jpeg', 0.6).split(',')[1];
        
        sessionPromiseRef.current?.then(session => {
            session.sendRealtimeInput({
                media: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                }
            });
        });

    }, 1000); // 1 FPS for efficiency in demo
    frameIntervalRef.current = interval;
  };

  const playAudioResponse = async (base64Audio: string) => {
     if (!audioContextRef.current) return;

     const ctx = audioContextRef.current;
     // Ensure time is moving forward
     nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

     try {
         const audioBuffer = await decodeAudioData(
             decode(base64Audio),
             ctx,
             24000,
             1
         );
         
         const source = ctx.createBufferSource();
         source.buffer = audioBuffer;
         source.connect(ctx.destination);
         
         source.addEventListener('ended', () => {
             sourcesRef.current.delete(source);
         });
         
         source.start(nextStartTimeRef.current);
         sourcesRef.current.add(source);
         nextStartTimeRef.current += audioBuffer.duration;
         
     } catch (e) {
         console.error("Audio decode error", e);
     }
  };

  const disconnect = () => {
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;
    
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    
    if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
    }
    
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    
    setStatus('disconnected');
    setIsActive(false);
  };

  // Toggle Video Logic
  const toggleVideo = async () => {
      // Simplification: In a real app, we might renegotiate the stream.
      // Here, we'll just toggle the boolean which stops the frame sending loop.
      // If turning ON from OFF, we might need to re-request stream if video track wasn't initially there.
      // For this demo, connection restart is safest if video requirement changes.
      if (status === 'connected') {
          disconnect();
          setIsVideoOn(!isVideoOn);
          // Auto-reconnect not implemented to avoid loops, user manually clicks start again
      } else {
          setIsVideoOn(!isVideoOn);
      }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-surface relative overflow-hidden">
      {/* Background Visuals */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          {status === 'connected' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
          )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl px-4">
        
        {/* Status / Error */}
        {errorMessage && (
            <div className="bg-red-500/20 text-red-200 px-4 py-2 rounded-lg border border-red-500/50 mb-4">
                {errorMessage}
            </div>
        )}

        {/* Avatar / Video Preview */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-surfaceLight border-4 border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center">
            {isVideoOn && streamRef.current ? (
                <video 
                    ref={videoRef} 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]" 
                />
            ) : (
                <div className="text-primary-400">
                     {status === 'connected' ? (
                         <div className="flex gap-1 items-end h-16">
                             <div className="w-3 bg-primary-400 animate-wave" style={{animationDelay: '0s'}}></div>
                             <div className="w-3 bg-primary-400 animate-wave" style={{animationDelay: '0.2s'}}></div>
                             <div className="w-3 bg-primary-400 animate-wave" style={{animationDelay: '0.4s'}}></div>
                             <div className="w-3 bg-primary-400 animate-wave" style={{animationDelay: '0.1s'}}></div>
                         </div>
                     ) : (
                         <Volume2 size={64} className="opacity-50" />
                     )}
                </div>
            )}
            
            {/* Live Indicator */}
            {status === 'connected' && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live</span>
                </div>
            )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />

        {/* Controls */}
        <div className="flex items-center gap-6">
            <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-4 rounded-full transition-all ${isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500/20 text-red-500 border border-red-500'}`}
            >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            {status === 'connected' ? (
                <button 
                    onClick={disconnect}
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-900/50 transition-all hover:scale-105 active:scale-95"
                >
                    <Power size={32} className="text-white" />
                </button>
            ) : (
                <button 
                    onClick={connect}
                    disabled={status === 'connecting'}
                    className="w-20 h-20 rounded-full bg-primary-600 hover:bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-900/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                >
                    <Power size={32} className="text-white" />
                </button>
            )}

            <button 
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-all ${isVideoOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-surfaceLight text-slate-400 border border-slate-700 hover:bg-slate-800'}`}
            >
                {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
        </div>
        
        <p className="text-slate-500 text-sm font-medium">
            {status === 'disconnected' && "Tap to start conversation"}
            {status === 'connecting' && "Connecting to Gemini..."}
            {status === 'connected' && "Listening..."}
        </p>
      </div>
    </div>
  );
};

export default LiveMode;