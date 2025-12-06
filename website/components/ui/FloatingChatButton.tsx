/**
 * Floating chatbot button for quick access to AI assistant
 * Enhanced with professional UI/UX, markdown support, and smooth animations
 */

'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, X, Send, Bot, RefreshCw, Copy, Check, ChevronDown, LogIn } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
}

const MAX_QUESTIONS_FOR_GUEST = 5;

export default function FloatingChatButton() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: '**Xin chào!** Tôi là trợ lý hỗ trợ của UrbanReflex.\n\nTôi có thể giúp bạn:\n- Tìm hiểu về hệ thống\n- Hướng dẫn sử dụng\n- Trả lời câu hỏi\n- Hỗ trợ kỹ thuật\n\nBạn cần hỗ trợ gì hôm nay?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [buttonRightOffset, setButtonRightOffset] = useState(24); // px, tương đương right-6
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Đếm số câu hỏi của user (chỉ đếm user messages, không tính welcome message)
  const userQuestionCount = useMemo(() => {
    return messages.filter(msg => msg.role === 'user').length;
  }, [messages]);
  
  // Check nếu đã đạt giới hạn và chưa login
  const hasReachedLimit = !isAuthenticated && userQuestionCount >= MAX_QUESTIONS_FOR_GUEST;
  const dragStateRef = useRef<{ isDragging: boolean; startX: number; startRight: number; moved: boolean; containerWidth: number }>({
    isDragging: false,
    startX: 0,
    startRight: 24,
    moved: false,
    containerWidth: 72, // default approx width of button
  });

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

  // Horizontal drag for chatbot (kéo qua trái/phải)
  useEffect(() => {
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState.isDragging) return;

      const clientX =
        event instanceof TouchEvent ? event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX : event.clientX;
      if (clientX == null) return;

      const deltaX = clientX - dragState.startX;
      // Khi kéo sang trái (deltaX > 0) thì giảm right, kéo sang phải tăng right
      let nextRight = dragState.startRight - deltaX;

      // Giới hạn trong viewport: đảm bảo toàn bộ container vẫn nằm trong màn hình
      const minRight = 8; // khoảng cách mép phải tối thiểu
      const viewportWidth = window.innerWidth || 0;
      const maxRight = Math.max(8, viewportWidth - dragState.containerWidth - 8);
      if (nextRight < minRight) nextRight = minRight;
      if (nextRight > maxRight) nextRight = maxRight;

      // Đánh dấu là đã kéo (để không trigger click khi chỉ muốn kéo)
      if (Math.abs(deltaX) > 3) {
        dragState.moved = true;
      }

      setButtonRightOffset(nextRight);
    };

    const handlePointerUp = () => {
      const dragState = dragStateRef.current;
      dragState.isDragging = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  const startDrag = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    const clientX =
      'touches' in event ? event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX : event.clientX;
    if (clientX == null) return;
    dragState.isDragging = true;
    dragState.moved = false;
    dragState.startX = clientX;
    dragState.startRight = buttonRightOffset;
    // Ước lượng width hiện tại của container để clamp (chat window rộng hơn floating button)
    dragState.containerWidth = isOpen ? (isMinimized ? 320 : 420) : 72;
  };

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
    if (confirm('Bạn có chắc muốn bắt đầu cuộc trò chuyện mới?')) {
      setMessages([
        {
          id: String(Date.now()),
          role: 'assistant',
          content: '**Xin chào!** Tôi là trợ lý hỗ trợ của UrbanReflex.\n\nTôi có thể giúp bạn:\n- Tìm hiểu về hệ thống\n- Hướng dẫn sử dụng\n- Trả lời câu hỏi\n- Hỗ trợ kỹ thuật\n\nBạn cần hỗ trợ gì hôm nay?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;
    
    // Check giới hạn cho guest users
    if (!isAuthenticated && userQuestionCount >= MAX_QUESTIONS_FOR_GUEST) {
      return; // Không cho phép gửi thêm
    }

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
          content: data.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này. Vui lòng thử lại sau.',
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
          content: '**Lỗi kết nối**\n\nXin lỗi, đã có lỗi xảy ra khi kết nối với hệ thống.\n\nVui lòng:\n- Thử lại sau\n- Kiểm tra kết nối mạng\n- Liên hệ đội ngũ hỗ trợ nếu lỗi vẫn tiếp diễn',
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
      if (!hasReachedLimit) {
        handleSendMessage();
      }
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Custom markdown components - UrbanReflex Style
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
          className="rounded-lg text-sm my-2 border-2 border-[#64BABE]"
        >
          {codeString}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-[#64BABE] text-white px-1.5 py-0.5 rounded text-sm font-mono border border-[#008EA0] font-bold" {...rest}>
          {children}
        </code>
      );
    },
    p: ({ children }) => <p className="mb-2 last:mb-0 text-sm text-gray-800">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm text-gray-800">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-sm text-gray-800">{children}</ol>,
    li: ({ children }) => <li className="ml-2">{children}</li>,
    h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 text-[#008EA0]">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 text-[#008EA0]">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-2 text-[#008EA0]">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#64BABE] pl-4 py-2 my-2 bg-[#64BABE]/10 rounded-r border-t-2 border-b-2 border-r-2 border-[#64BABE]">
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#008EA0] hover:text-[#085979] underline font-bold">
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold text-[#008EA0]">{children}</strong>,
  };

  return (
    <>
      {/* Floating Button - UrbanReflex Style */}
      {!isOpen && (
        <div
          className="fixed bottom-6 z-50"
          style={{ right: `${buttonRightOffset}px` }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <button
            onClick={() => {
              if (dragStateRef.current.moved) {
                dragStateRef.current.moved = false;
                return;
              }
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="relative bg-white border-2 border-[#008EA0] text-[#008EA0] rounded-lg px-4 py-3 shadow-[4px_4px_0_0_#008EA0] hover:shadow-[6px_6px_0_0_#008EA0] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#008EA0] group flex items-center gap-3"
            aria-label="Open Chatbot"
          >
            <div className="w-9 h-9 bg-[#64BABE] rounded-lg flex items-center justify-center border-2 border-[#008EA0]">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#008EA0]">Need Help?</div>
              <div className="text-xs text-gray-600">Chat with us</div>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window - UrbanReflex Style */}
      {isOpen && (
        <div
          className={`fixed bottom-6 z-50 bg-white rounded-lg shadow-[8px_8px_0_0_#008EA0] border-2 border-[#008EA0] transition-all duration-300 ease-out ${
            isMinimized
              ? 'w-80 h-16 scale-95'
              : 'w-[420px] h-[680px] scale-100'
          } flex flex-col overflow-hidden`}
          style={{
            right: `${buttonRightOffset}px`,
          }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          {/* Header - UrbanReflex Style */}
          <div className="bg-gradient-to-r from-[#008EA0] to-[#64BABE] border-b-2 border-[#085979] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-white/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">UrbanReflex Support</h3>
                <p className="text-xs text-white/80">We're here to help</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white hover:text-white border border-transparent hover:border-white/30"
                aria-label="Reset chat"
                title="Bắt đầu lại"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white hover:text-white border border-transparent hover:border-white/30"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages - HackQuest Style */}
              <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-white"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#E5E7EB transparent',
                }}
              >
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-[#64BABE] rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#008EA0]">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <div
                        className={`group relative rounded-lg px-4 py-3 border-2 transition-all duration-200 ${
                          message.role === 'user'
                            ? 'bg-[#008EA0] text-white border-[#085979] shadow-[2px_2px_0_0_#085979]'
                            : 'bg-white text-gray-800 border-[#64BABE] shadow-[2px_2px_0_0_#64BABE]'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                            <ReactMarkdown components={MarkdownComponents}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                        )}
                        
                        {/* Copy button */}
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-white border-2 border-[#008EA0] rounded-md p-1.5 transition-all duration-200 hover:bg-[#64BABE] shadow-[2px_2px_0_0_#008EA0]"
                            aria-label="Copy message"
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="w-3 h-3 text-[#008EA0]" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#008EA0]" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      <div className={`flex items-center gap-1.5 px-2 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-[10px] text-gray-600 font-medium">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-[#085979] rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#008EA0]">
                        <span className="text-xs font-bold text-white">U</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-[#64BABE] rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#008EA0]">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white text-gray-800 border-2 border-[#64BABE] rounded-lg px-4 py-3 shadow-[2px_2px_0_0_#64BABE]">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-[#008EA0] rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-[#008EA0] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-2 h-2 bg-[#008EA0] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
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
                  className="absolute bottom-32 right-6 bg-white border-2 border-[#008EA0] rounded-lg p-2 shadow-[2px_2px_0_0_#008EA0] hover:shadow-[4px_4px_0_0_#008EA0] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 z-10"
                  aria-label="Scroll to bottom"
                >
                  <ChevronDown className="w-4 h-4 text-[#008EA0]" />
                </button>
              )}

              {/* Input - UrbanReflex Style */}
              <div className="p-4 border-t-2 border-[#64BABE] bg-white">
                {/* Thông báo giới hạn cho guest users */}
                {!isAuthenticated && (
                  <div className={`mb-3 p-3 rounded-lg border-2 ${
                    hasReachedLimit 
                      ? 'bg-[#F3505A]/10 border-[#F3505A]' 
                      : 'bg-[#64BABE]/10 border-[#64BABE]'
                  }`}>
                    {hasReachedLimit ? (
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-[#F3505A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#D4343F] mb-1">
                            Đã đạt giới hạn {MAX_QUESTIONS_FOR_GUEST} câu hỏi
                          </p>
                          <p className="text-xs text-gray-700 mb-2">
                            Vui lòng đăng nhập để tiếp tục sử dụng chatbot.
                          </p>
                          <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#008EA0] hover:bg-[#085979] text-white text-sm font-bold rounded-lg border-2 border-[#085979] shadow-[2px_2px_0_0_#085979] hover:shadow-[4px_4px_0_0_#085979] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
                          >
                            <LogIn className="w-4 h-4" />
                            Đăng nhập ngay
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-[#64BABE] rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-xs text-gray-700 font-medium">
                          Bạn còn <span className="font-bold text-[#008EA0]">{MAX_QUESTIONS_FOR_GUEST - userQuestionCount}</span> câu hỏi miễn phí. 
                          <Link href="/login" className="text-[#008EA0] hover:text-[#085979] underline font-bold ml-1">
                            Đăng nhập
                          </Link> để không giới hạn.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={hasReachedLimit ? "Vui lòng đăng nhập để tiếp tục..." : "Type your message..."}
                      rows={1}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none bg-white text-sm font-medium text-gray-800 ${
                        hasReachedLimit
                          ? 'border-[#F3505A] bg-gray-50 cursor-not-allowed'
                          : 'border-[#64BABE] focus:ring-[#008EA0] focus:border-[#008EA0]'
                      }`}
                      style={{
                        minHeight: '44px',
                        maxHeight: '120px',
                      }}
                      disabled={isTyping || hasReachedLimit}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                      }}
                    />
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping || hasReachedLimit}
                    className="bg-[#008EA0] hover:bg-[#085979] text-white p-2.5 rounded-lg border-2 border-[#085979] shadow-[2px_2px_0_0_#085979] hover:shadow-[4px_4px_0_0_#085979] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_0_#085979] flex-shrink-0 font-bold"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[10px] text-gray-600 font-medium">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 border border-[#64BABE] rounded text-[9px] font-mono font-bold text-[#008EA0]">Enter</kbd> to send
                  </p>
                  {isTyping && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#008EA0] rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-gray-600 font-medium">Typing...</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Global styles */}
      <style jsx global>{`
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #F3F4F6;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
    </>
  );
}

