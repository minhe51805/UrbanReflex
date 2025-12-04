/**
 * Floating chatbot button for quick access to AI assistant
 * Enhanced with professional UI/UX, markdown support, and smooth animations
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Minimize2, Sparkles, RefreshCw, Copy, Check, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
}

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: '👋 **Xin chào!** Tôi là trợ lý AI của **UrbanReflex**.\n\nTôi có thể giúp bạn:\n- 🔍 Tìm hiểu về hệ thống\n- 📚 Hướng dẫn sử dụng\n- 💡 Trả lời câu hỏi\n- 🛠️ Hỗ trợ kỹ thuật\n\nBạn cần hỗ trợ gì hôm nay?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isMinimized]);

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleReset = () => {
    if (confirm('🔄 Bạn có chắc muốn bắt đầu cuộc trò chuyện mới?')) {
      setMessages([
        {
          id: String(Date.now()),
          role: 'assistant',
          content: '👋 **Xin chào!** Tôi là trợ lý AI của **UrbanReflex**.\n\nTôi có thể giúp bạn:\n- 🔍 Tìm hiểu về hệ thống\n- 📚 Hướng dẫn sử dụng\n- 💡 Trả lời câu hỏi\n- 🛠️ Hỗ trợ kỹ thuật\n\nBạn cần hỗ trợ gì hôm nay?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    const messageId = String(Date.now());
    setInputMessage('');
    
    setMessages((prev) => [
      ...prev,
      { id: messageId, role: 'user', content: userMessage, timestamp: new Date() },
    ]);

    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://163.61.183.90:8001'}/ai-service/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          session_id: sessionId,
          context_limit: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          role: 'assistant',
          content: data.response || '❌ Xin lỗi, tôi không thể trả lời câu hỏi này. Vui lòng thử lại sau.',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          role: 'assistant',
          content: '⚠️ **Lỗi kết nối**\n\nXin lỗi, đã có lỗi xảy ra khi kết nối với trợ lý AI.\n\n🔧 Vui lòng:\n- Thử lại sau\n- Kiểm tra kết nối mạng\n- Liên hệ đội ngũ hỗ trợ nếu lỗi vẫn tiếp diễn',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Custom markdown components for better rendering
  const MarkdownComponents: Partial<Components> = {
    code(props) {
      const { children, className, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className;
      const codeString = String(children).replace(/\n$/, '');
      
      return !isInline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus as { [key: string]: React.CSSProperties }}
          language={match[1]}
          PreTag="div"
          className="rounded-lg text-sm my-2"
        >
          {codeString}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono" {...rest}>
          {children}
        </code>
      );
    },
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="ml-2">{children}</li>,
    h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-2 bg-blue-50 rounded-r">
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
  };

  return (
    <>
      {/* Floating Button with Pulse Animation */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-pulse opacity-30"></div>
            
            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white rounded-full p-5 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 group"
              aria-label="Open Chatbot"
            >
              <MessageCircle className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 flex">
                <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
              </span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Chat với AI Assistant
                <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Chat Window - Enhanced Design */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl border border-gray-200/50 transition-all duration-500 ease-out ${
            isMinimized
              ? 'w-80 h-16 scale-95'
              : 'w-[420px] h-[680px] scale-100'
          } flex flex-col overflow-hidden`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Header - Glassmorphic Design */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white p-5 flex items-center justify-between overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"></div>
            
            <div className="relative flex items-center gap-3 z-10">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  UrbanReflex AI
                  <span className="px-2 py-0.5 bg-green-400/20 backdrop-blur-sm border border-green-300/30 rounded-full text-[10px] font-medium">
                    Online
                  </span>
                </h3>
                <p className="text-xs text-blue-100 font-medium">Trợ lý thông minh • Luôn sẵn sàng</p>
              </div>
            </div>
            
            <div className="relative flex items-center gap-1 z-10">
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Reset chat"
                title="Bắt đầu lại"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages - Enhanced with Markdown */}
              <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E1 transparent',
                }}
              >
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-fade-in`}
                    style={{
                      animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <div
                        className={`group relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                            <ReactMarkdown components={MarkdownComponents}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        )}
                        
                        {/* Copy button */}
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-white border border-gray-300 rounded-lg p-1.5 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                            aria-label="Copy message"
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-gray-600" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      <div className={`flex items-center gap-1.5 px-2 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-sm font-bold text-white">U</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator - Enhanced */}
                {isTyping && (
                  <div className="flex gap-3 justify-start animate-fade-in">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"></span>
                        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll to bottom button */}
              {showScrollButton && (
                <button
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-32 right-8 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 z-10"
                  aria-label="Scroll to bottom"
                >
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              )}

              {/* Input - Enhanced Design */}
              <div className="p-4 border-t border-gray-200/80 bg-white/80 backdrop-blur-xl">
                <div className="flex gap-2.5 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Nhập tin nhắn của bạn..."
                      rows={1}
                      className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-gray-50 hover:bg-white text-sm leading-relaxed"
                      style={{
                        minHeight: '48px',
                        maxHeight: '120px',
                      }}
                      disabled={isTyping}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                      }}
                    />
                    {inputMessage.length > 0 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                        {inputMessage.length}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-gray-500 font-medium">
                    <kbd className="px-2 py-0.5 bg-gray-200 rounded text-[10px] font-mono">Enter</kbd> gửi • 
                    <kbd className="px-2 py-0.5 bg-gray-200 rounded text-[10px] font-mono ml-1">Shift+Enter</kbd> xuống dòng
                  </p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-gray-500 font-medium">AI đang hoạt động</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out both;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </>
  );
}

