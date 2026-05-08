import { supabase } from '../lib/supabase';

class ChatService {
  /**
   * Khởi tạo hoặc lấy conversation của user
   */
  async getOrCreateConversation(userId, userName, userEmail) {
    // Tìm conversation đang active
    const { data: existing, error: findError } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (findError) {
      console.error('Error finding conversation:', findError);
      return null;
    }

    if (existing) {
      return existing;
    }

    // Nếu chưa có, tạo mới
    const { data: newConv, error: createError } = await supabase
      .from('chat_conversations')
      .insert([
        {
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          status: 'active'
        }
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      return null;
    }

    return newConv;
  }

  /**
   * Lấy lịch sử tin nhắn
   */
  async getMessages(conversationId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error getting messages:', error);
      return [];
    }

    return data;
  }

  /**
   * Gửi tin nhắn mới
   */
  async sendMessage(conversationId, senderId, senderRole, content, imageUrl = null) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: senderId,
          sender_role: senderRole,
          content,
          image_url: imageUrl
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    // Update conversation last_message và unread_count (nếu user gửi)
    const updateData = {
      last_message: imageUrl ? '[Hình ảnh]' : content,
      last_message_at: new Date().toISOString()
    };

    // Nếu người gửi là user, tăng unread_count lên để admin thấy
    if (senderRole === 'user') {
      // Đầu tiên phải lấy current unread_count
      const { data: conv } = await supabase
        .from('chat_conversations')
        .select('unread_count')
        .eq('id', conversationId)
        .single();
        
      if (conv) {
        updateData.unread_count = (conv.unread_count || 0) + 1;
      }
    }

    await supabase
      .from('chat_conversations')
      .update(updateData)
      .eq('id', conversationId);

    return data;
  }

  /**
   * Gửi tin nhắn tự động khi user bắt đầu chat
   */
  async sendAutoReply(conversationId) {
    // Check if system reply already exists
    const { data: existingMessages } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('sender_role', 'system')
      .limit(1);

    if (existingMessages && existingMessages.length > 0) {
      return null; // Already auto-replied
    }

    const content = "Chào Anh/Chị, cảm ơn Anh/Chị đã liên hệ Farmily. Anh/chị vui lòng để lại tin nhắn và chờ trong ít phút, nhân viên hỗ trợ sẽ phản hồi ngay ạ.";
    
    return this.sendMessage(
      conversationId,
      '00000000-0000-0000-0000-000000000000', // System ID dummy
      'system',
      content
    );
  }

  /**
   * Đánh dấu đã đọc (cho admin hoặc user)
   */
  async markAsRead(conversationId, role) {
    if (role === 'admin') {
      // Admin đọc -> reset unread_count của conversation về 0
      await supabase
        .from('chat_conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId);
        
      // Đánh dấu các tin nhắn của user là đã đọc
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_role', 'user')
        .eq('is_read', false);
    } else {
      // User đọc -> đánh dấu các tin nhắn của admin là đã đọc
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_role', 'admin')
        .eq('is_read', false);
    }
  }

  /**
   * Lấy danh sách conversation (Admin)
   */
  async getConversations() {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error getting conversations:', error);
      return [];
    }

    return data;
  }

  /**
   * Upload hình ảnh lên Storage
   */
  async uploadImage(file) {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('chat-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-images')
      .getPublicUrl(filePath);

    return publicUrl;
  }

  /**
   * Đăng ký nhận tin nhắn realtime
   */
  subscribeToMessages(conversationId, callback) {
    const channelId = `messages:${conversationId}:${Math.random().toString(36).substring(7)}`;
    return supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }

  /**
   * Đăng ký nhận danh sách conversation realtime (Admin)
   */
  subscribeToConversations(callback) {
    const channelId = `admin_conversations:${Math.random().toString(36).substring(7)}`;
    return supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations'
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }
}

export const chatService = new ChatService();
