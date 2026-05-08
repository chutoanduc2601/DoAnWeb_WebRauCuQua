import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Image as ImageIcon, MessageCircle, Check, CheckCheck, Loader2, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { chatService } from '../../services/chatService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ChatSupport() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesSubRef = useRef(null);
  const convSubRef = useRef(null);

  // Load conversations list
  useEffect(() => {
    loadConversations();
    
    // Subscribe to conversation list changes
    convSubRef.current = chatService.subscribeToConversations((payload) => {
      // Refresh the whole list is easier to maintain sorting, or update specific item
      loadConversations();
    });

    return () => {
      if (convSubRef.current) convSubRef.current.unsubscribe();
    };
  }, []);

  const loadConversations = async () => {
    const data = await chatService.getConversations();
    setConversations(data);
    setFilteredConversations(data);
    setIsLoading(false);
  };

  // Filter conversations
  useEffect(() => {
    if (!searchQuery) {
      setFilteredConversations(conversations);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredConversations(
        conversations.filter(c => 
          c.user_name?.toLowerCase().includes(q) || 
          c.user_email?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, conversations]);

  // Load messages when selecting conversation
  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id);
      
      // Mark as read
      chatService.markAsRead(selectedConv.id, 'admin');
      
      // Update local unread_count for selected conv
      setConversations(prev => prev.map(c => 
        c.id === selectedConv.id ? { ...c, unread_count: 0 } : c
      ));

      // Subscribe to messages for this conversation
      if (messagesSubRef.current) messagesSubRef.current.unsubscribe();
      
      messagesSubRef.current = chatService.subscribeToMessages(selectedConv.id, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new]);
          // If user sends message while admin is viewing, mark as read immediately
          if (payload.new.sender_role === 'user') {
            chatService.markAsRead(selectedConv.id, 'admin');
          }
        } else if (payload.eventType === 'UPDATE') {
          setMessages(prev => prev.map(msg => msg.id === payload.new.id ? payload.new : msg));
        }
      });
    } else {
      setMessages([]);
      if (messagesSubRef.current) {
        messagesSubRef.current.unsubscribe();
        messagesSubRef.current = null;
      }
    }

    return () => {
      if (messagesSubRef.current) {
        messagesSubRef.current.unsubscribe();
      }
    };
  }, [selectedConv]);

  const loadMessages = async (convId) => {
    const msgs = await chatService.getMessages(convId);
    setMessages(msgs);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() && !isUploading) return;
    if (!selectedConv) return;
    
    const content = newMessage.trim();
    setNewMessage('');
    
    await chatService.sendMessage(selectedConv.id, user.id, 'admin', content);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConv) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await chatService.uploadImage(file);
      if (imageUrl) {
        await chatService.sendMessage(selectedConv.id, user.id, 'admin', '', imageUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex overflow-hidden">
      
      {/* Left Panel: Conversations List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hỗ trợ khách hàng</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto admin-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Không có cuộc hội thoại nào
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    selectedConv?.id === conv.id ? 'bg-brand-50 dark:bg-brand-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center">
                      <UserCircle2 className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                          {conv.user_name || 'Khách hàng'}
                        </h4>
                        <span className="text-xs text-slate-500 shrink-0">
                          {conv.last_message_at ? formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true, locale: vi }) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {conv.user_email}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${conv.unread_count > 0 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                          {conv.last_message || 'Bắt đầu trò chuyện'}
                        </p>
                        {conv.unread_count > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Chat Details */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950/50">
        {selectedConv ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <UserCircle2 className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {selectedConv.user_name || 'Khách hàng'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedConv.user_email}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 admin-scrollbar">
              {messages.map((msg, index) => {
                const isAdmin = msg.sender_role === 'admin';
                const isSystem = msg.sender_role === 'system';
                
                return (
                  <div 
                    key={msg.id || index} 
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                        isAdmin 
                          ? 'bg-brand-500 text-white rounded-tr-sm' 
                          : isSystem 
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-tl-sm mx-auto my-2 text-center text-xs'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                      }`}
                    >
                      {msg.image_url && (
                        <img 
                          src={msg.image_url} 
                          alt="Attachment" 
                          className="max-w-full rounded-lg mb-1 object-cover cursor-pointer"
                          onClick={() => window.open(msg.image_url, '_blank')}
                        />
                      )}
                      {msg.content && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
                    </div>
                    
                    {/* Metadata */}
                    {!isSystem && (
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-xs text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isAdmin && (
                          msg.is_read 
                            ? <CheckCheck className="w-3.5 h-3.5 text-brand-500" />
                            : <Check className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto">
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
                  className="p-2.5 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-colors shrink-0"
                  disabled={isUploading}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập câu trả lời..."
                    className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-700 dark:text-slate-200"
                    disabled={isUploading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !isUploading) || isUploading}
                  className="p-3 text-white bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl transition-colors shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <p>Chọn một cuộc trò chuyện để bắt đầu hỗ trợ</p>
          </div>
        )}
      </div>
    </div>
  );
}
