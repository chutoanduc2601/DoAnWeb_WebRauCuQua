import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy profile từ bảng profiles, tự động tạo mới nếu chưa tồn tại (đặc biệt hữu ích cho luồng đăng nhập OAuth)
  const fetchProfile = async (userId, userObj = null) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // PGRST116: Không tìm thấy kết quả nào
      if (error.code === 'PGRST116' && userObj) {
        console.log('Profile chưa tồn tại, tiến hành tạo mới cho OAuth user...');
        const name = userObj.user_metadata?.full_name || userObj.user_metadata?.name || userObj.email?.split('@')[0] || 'Người dùng';
        const avatar_url = userObj.user_metadata?.avatar_url || userObj.user_metadata?.picture || null;
        
        const newProfile = {
          id: userId,
          name,
          avatar_url,
          role: 'user',
          created_at: new Date().toISOString()
        };

        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (!insertError) {
          return insertedData;
        } else {
          console.error('Lỗi khi tự động tạo profile:', insertError);
        }
      }
      console.error('Lỗi khi lấy profile:', error);
      return null;
    }
    return data;
  };

  // Khởi tạo: kiểm tra session hiện tại
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id, session.user);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Lỗi khởi tạo auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Lắng nghe thay đổi auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          // Đợi 1 chút để trigger tạo profile hoàn tất, nếu không có sẽ tự động chèn
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id, session.user);
            setProfile(profileData);
          }, 500);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Đăng ký
  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Lưu vào raw_user_meta_data, trigger sẽ dùng
      },
    });

    if (error) throw error;

    // Nếu đăng ký thành công, lấy profile
    if (data.user) {
      // Đợi trigger tạo profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      const profileData = await fetchProfile(data.user.id, data.user);
      setProfile(profileData);
    }

    return data;
  };

  // Đăng nhập
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const profileData = await fetchProfile(data.user.id, data.user);
      setProfile(profileData);
    }

    return data;
  };

  // Đăng nhập bằng OAuth (Google, Facebook)
  const signInWithOAuth = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  };

  // Đăng xuất
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  // Cập nhật profile
  const updateProfile = async (updates) => {
    if (!user) throw new Error('Cần đăng nhập để cập nhật profile');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  // Khôi phục mật khẩu (Gửi email)
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  };

  // Cập nhật mật khẩu mới
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    isAdmin: profile?.role === 'admin',
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
}
