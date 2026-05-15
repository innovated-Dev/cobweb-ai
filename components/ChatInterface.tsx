'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, RefreshCw, ChevronDown } from 'lucide-react';
import { Message } from '@/lib/types';
import { WELCOME_MESSAGE } from '@/lib/prompt';
import { Markdown } from './Markdown';
import { CobwebLogo } from './CobwebLogo';

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="w-1.5 h-1.5 rounded-full bg-web-accent typing-dot" />
      <div className="w-1.5 h-1.5 rounded-full bg-web-accent typing-dot" />
      <div className="w-1.5 h-1.5 rounded-full bg-web-accent typing-dot" />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fade-up">
        <div className="max-w-[80%] sm:max-w-[70%]">
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
            style={{
              background: 'linear-gradient(135deg, #7B5EA7 0%, #5A3D8A 100%)',
              color: '#E8DCC8',
            }}
          >
            {message.content}
          </div>
          <div className="text-right mt-1">
            <span className="text-xs text-web-muted">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-5 animate-fade-up">
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: '#111118', border: '1px solid #2E2E4E' }}
        >
          <CobwebLogo size={20} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div
          className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm"
          style={{
            background: '#111118',
            border: '1px solid #1E1E2E',
          }}
        >
          <Markdown content={message.content} />
        </div>
        <div className="mt-1">
          <span className="text-xs text-web-muted">
            CobWEB · {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    if (!isLoading) scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (streamingContent) scrollToBottom();
  }, [streamingContent, scrollToBottom]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollButton(distFromBottom > 200);
  };

  const autoResizeTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    abortControllerRef.current = new AbortController();

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error('Failed to get response');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setStreamingContent(accumulated);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: accumulated,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;

      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your API key is set correctly and try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    if (isLoading) {
      abortControllerRef.current?.abort();
    }
    setMessages([WELCOME_MESSAGE]);
    setStreamingContent('');
    setIsLoading(false);
    setInput('');
  };

  const suggestedPrompts = [
    "I'm building an online store for handmade jewelry",
    "I need a website for my freelance design studio",
    "I want to sell digital courses and memberships",
    "I run a local restaurant and need a booking site",
  ];

  const showSuggestions = messages.length === 1;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4"
        style={{ borderBottom: '1px solid #1E1E2E', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3">
          <CobwebLogo size={36} className="logo-glow" />
          <div>
            <h1 className="font-display font-bold text-lg leading-none" style={{ color: '#E8DCC8' }}>
              CobWEB
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#7B5EA7' }}>AI Setup Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#4A4A6A' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="hidden sm:inline">Online</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 hover:opacity-80"
            style={{ background: '#1E1E2E', color: '#7B5EA7', border: '1px solid #2E2E4E' }}
            title="Start new conversation"
          >
            <RefreshCw size={12} />
            <span className="hidden sm:inline">New chat</span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="max-w-3xl mx-auto">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Streaming message */}
          {isLoading && streamingContent && (
            <div className="flex gap-3 mb-5 animate-fade-up">
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#111118', border: '1px solid #2E2E4E' }}
                >
                  <CobwebLogo size={20} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm"
                  style={{ background: '#111118', border: '1px solid #1E1E2E' }}
                >
                  <Markdown content={streamingContent} />
                  <span
                    className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                    style={{ background: '#7B5EA7', animation: 'blink 1s step-end infinite' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator (no content yet) */}
          {isLoading && !streamingContent && (
            <div className="flex gap-3 mb-5">
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#111118', border: '1px solid #2E2E4E' }}
                >
                  <CobwebLogo size={20} />
                </div>
              </div>
              <div
                className="px-4 rounded-2xl rounded-tl-sm"
                style={{ background: '#111118', border: '1px solid #1E1E2E' }}
              >
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Suggested prompts */}
          {showSuggestions && (
            <div className="mt-4 mb-2 animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
              <p className="text-xs mb-3" style={{ color: '#4A4A6A' }}>Quick starts:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(prompt);
                      textareaRef.current?.focus();
                    }}
                    className="text-left px-3 py-2.5 rounded-xl text-xs transition-all duration-200 hover:border-web-accent group"
                    style={{
                      background: '#111118',
                      border: '1px solid #1E1E2E',
                      color: '#8A82B8',
                    }}
                  >
                    <span className="text-web-gold mr-2 group-hover:mr-3 transition-all">→</span>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-90 z-10"
          style={{ background: '#1E1E2E', border: '1px solid #2E2E4E', color: '#7B5EA7' }}
        >
          <ChevronDown size={16} />
        </button>
      )}

      {/* Input area */}
      <div
        className="flex-shrink-0 px-4 sm:px-6 py-4"
        style={{ borderTop: '1px solid #1E1E2E', background: 'rgba(10,10,15,0.98)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-200 focus-within:border-web-accent"
            style={{ background: '#111118', border: '1px solid #2E2E4E' }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); autoResizeTextarea(); }}
              onKeyDown={handleKeyDown}
              placeholder="Tell me about your business..."
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed placeholder-web-muted disabled:opacity-50"
              style={{ color: '#D4CCFF', maxHeight: '160px', minHeight: '24px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 hover:scale-105 active:scale-95"
              style={{ background: input.trim() && !isLoading ? '#7B5EA7' : '#2E2E4E' }}
            >
              <Send size={14} className="text-white" style={{ transform: 'translateX(1px)' }} />
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: '#2E2E4E' }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
