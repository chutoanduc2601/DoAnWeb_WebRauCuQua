import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Image as ImageIcon, Check, CheckCheck, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { chatService } from '../services/chatService';

export default function ChatWidget() {
  const { user, profile, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const subscriptionRef = useRef(null);
  const conversationSubscriptionRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Load conversation and messages when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversation();
    } else {
      setConversation(null);
      setMessages([]);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (conversationSubscriptionRef.current) {
        conversationSubscriptionRef.current.unsubscribe();
      }
    }
    
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (conversationSubscriptionRef.current) {
        conversationSubscriptionRef.current.unsubscribe();
      }
    };
  }, [isAuthenticated, user]);

  const loadConversation = async () => {
    const userName = profile?.name || user?.email?.split('@')[0] || 'User';
    const userEmail = profile?.email || user?.email || '';
    
    const conv = await chatService.getOrCreateConversation(user.id, userName, userEmail);
    if (conv) {
      setConversation(conv);
      
      // Load history
      const msgs = await chatService.getMessages(conv.id);
      setMessages(msgs);
      
      // Calculate unread count (messages from admin that user hasn't read)
      // Since this is just for badge, we assume if user hasn't opened chat, they are unread
      // But we will mark as read when chat is open
      
      // Subscribe to new messages
      subscriptionRef.current = chatService.subscribeToMessages(conv.id, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new]);
          if (!isOpen && payload.new.sender_role !== 'user') {
            setUnreadCount(prev => prev + 1);
          }
        } else if (payload.eventType === 'UPDATE') {
          setMessages(prev => prev.map(msg => msg.id === payload.new.id ? payload.new : msg));
        }
      });
    }
  };

  // Mark as read when opening chat
  useEffect(() => {
    if (isOpen && conversation) {
      setUnreadCount(0);
      chatService.markAsRead(conversation.id, 'user');
    }
  }, [isOpen, conversation]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!newMessage.trim() && !isUploading) return;
    
    const content = newMessage.trim();
    setNewMessage(''); // Clear input early for better UX
    
    // Add temp message to UI
    const tempId = Date.now().toString();
    const tempMsg = {
      id: tempId,
      conversation_id: conversation.id,
      sender_id: user.id,
      sender_role: 'user',
      content,
      created_at: new Date().toISOString(),
      is_read: false
    };
    
    setMessages(prev => [...prev, tempMsg]);

    // Check if this is the first user message to trigger auto-reply
    const isFirstMessage = !messages.some(m => m.sender_role === 'user');

    // Send to server
    const sentMsg = await chatService.sendMessage(conversation.id, user.id, 'user', content);
    
    // Replace temp message with real one (or let subscription handle it and just remove temp, 
    // but simpler to just let subscription add it and we filter duplicates)
    // Actually, since subscription will fire INSERT, we might get duplicate.
    // It's better to NOT add temp message if we trust the realtime speed, or we remove temp when receiving real.
    // For simplicity, we just send and let subscription update the list.
    setMessages(prev => prev.filter(m => m.id !== tempId));

    if (isFirstMessage && sentMsg) {
      // Trigger auto reply
      setTimeout(() => {
        chatService.sendAutoReply(conversation.id);
      }, 1000);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await chatService.uploadImage(file);
      if (imageUrl) {
        await chatService.sendMessage(conversation.id, user.id, 'user', '', imageUrl);
        
        const isFirstMessage = !messages.some(m => m.sender_role === 'user');
        if (isFirstMessage) {
          setTimeout(() => {
            chatService.sendAutoReply(conversation.id);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Only show widget if authenticated
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-brand-500 text-white rounded-full shadow-xl hover:bg-brand-600 hover:-translate-y-1 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Box Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[380px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-brand-500 px-4 py-3 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Hỗ trợ Farmily</h3>
                  <p className="text-xs text-brand-100">Chúng tôi luôn sẵn sàng hỗ trợ</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 admin-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                  <MessageCircle className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-sm">Bắt đầu cuộc trò chuyện với Farmily</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isUser = msg.sender_role === 'user';
                  const isSystem = msg.sender_role === 'system';
                  
                  return (
                    <div 
                      key={msg.id || index} 
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                          isUser 
                            ? 'bg-brand-500 text-white rounded-tr-sm' 
                            : isSystem 
                              ? 'bg-amber-50 border border-amber-100 text-slate-800 rounded-tl-sm mx-auto my-2 text-center text-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                        }`}
                      >
                        {msg.image_url && (
                          <img 
                            src={msg.image_url} 
                            alt="Attachment" 
                            className="max-w-full rounded-lg mb-1 object-cover"
                            onClick={() => window.open(msg.image_url, '_blank')}
                            style={{ cursor: 'pointer' }}
                          />
                        )}
                        {msg.content && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
                      </div>
                      
                      {/* Message Metadata */}
                      {!isSystem && (
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[10px] text-slate-400">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isUser && (
                            msg.is_read 
                              ? <CheckCheck className="w-3 h-3 text-brand-500" />
                              : <Check className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {isUploading && (
                <div className="flex justify-end">
                  <div className="bg-brand-500/20 text-brand-600 px-4 py-2 rounded-2xl rounded-tr-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Đang tải ảnh...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-colors shrink-0"
                  disabled={isUploading}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <div className="flex-1 bg-slate-100 rounded-2xl px-4 py-2 flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-700"
                    disabled={isUploading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !isUploading) || isUploading}
                  className="p-2 text-white bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-full transition-colors shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
