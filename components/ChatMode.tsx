import React, { useState, useRef, useEffect } from 'react';
import { Chat, GenerateContentResponse } from '@google/genai';
import { createChatSession, sendMessageStream } from '../services/gemini';
import { Message, Role, GroundingChunk } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Send, Bot, User, Loader2, Sparkles, MapPin } from 'lucide-react';

const ChatMode: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Initialize Chat
  useEffect(() => {
    // Get location for better grounding
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => console.log('Location access denied', err)
      );
    }
    
    // Create initial session
    const chat = createChatSession();
    setChatSession(chat);
    
    // Welcome message
    setMessages([
      {
        id: 'welcome',
        role: Role.MODEL,
        text: "Hi! I'm Migo. How can I help you today?",
        timestamp: Date.now()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatSession || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    const botMsg: Message = {
      id: botMsgId,
      role: Role.MODEL,
      text: '',
      timestamp: Date.now(),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, botMsg]);

    try {
      const result = await sendMessageStream(chatSession, userMsg.text);
      
      let fullText = '';
      let chunks: GroundingChunk[] = [];

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
        }
        
        // Accumulate grounding chunks if they appear (usually at the end)
        if (c.candidates?.[0]?.groundingMetadata?.groundingChunks) {
          // The chunks from API might be plain objects, need to cast or map safely
          const newChunks = c.candidates[0].groundingMetadata.groundingChunks as unknown as GroundingChunk[];
          chunks = [...chunks, ...newChunks];
        }

        setMessages(prev => prev.map(m => 
          m.id === botMsgId 
            ? { ...m, text: fullText, groundingChunks: chunks.length > 0 ? chunks : undefined } 
            : m
        ));
      }
      
      setMessages(prev => prev.map(m => 
        m.id === botMsgId ? { ...m, isStreaming: false } : m
      ));

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.map(m => 
        m.id === botMsgId ? { ...m, text: "Sorry, I encountered an error. Please try again.", isStreaming: false } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === Role.USER ? 'bg-indigo-600' : 'bg-emerald-600'}
            `}>
              {msg.role === Role.USER ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`
              max-w-[80%] rounded-2xl p-4 shadow-sm
              ${msg.role === Role.USER 
                ? 'bg-indigo-600/10 text-white rounded-tr-none border border-indigo-500/20' 
                : 'bg-surfaceLight text-slate-200 rounded-tl-none border border-slate-700'}
            `}>
              <MarkdownRenderer content={msg.text} groundingChunks={msg.groundingChunks} />
              {msg.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-primary-400 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surfaceLight border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-surface p-2 rounded-xl border border-slate-700 focus-within:border-primary-500 transition-colors">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Migo anything..."
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 p-2 max-h-32 min-h-[44px] resize-none focus:outline-none scrollbar-hide"
            rows={1}
            style={{ height: 'auto', minHeight: '44px' }} 
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${!inputText.trim() || isLoading 
                ? 'text-slate-600 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-900/20'}
            `}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-xs text-slate-500">Migo can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMode;