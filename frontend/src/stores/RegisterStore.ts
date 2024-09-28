import { create } from 'zustand';
import axios from 'axios';

// API'den dönecek yanıtları tanımladık
interface User {
  _id: string;
  UserName: string;
  UserMail: string;
}

// Zustand Store için state ve fonksiyonların tipini belirtiyoruz
interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  verificationCodeSent: boolean; // Doğrulama kodu gönderildi mi kontrolü
  isVerified: boolean;  // Kullanıcı doğrulama kodunu doğruladı mı kontrolü
  sendVerificationCode: (UserMail: string) => Promise<void>;
  verifyCode: (email: string, verificationCode: string) => Promise<void>;
  register: (userData: { UserName: string; UserMail: string; UserPassword: string }) => Promise<void>;
}

export const useRegisterStore = create<AuthState>((set) => ({
  user: null, 
  token: null, 
  isLoggedIn: false, 
  verificationCodeSent: false,
  isVerified: false,

  // Mail doğrulama kodu gönderme fonksiyonu
  sendVerificationCode: async (UserMail) => {
    try {
      await axios.post('http://localhost:8080/api/auth/mailcontrol', { email: UserMail });
      set({ verificationCodeSent: true });
    } catch (error) {
      console.error('Doğrulama kodu gönderilemedi:', error);
    }
  },

  // Kodu doğrulama fonksiyonu
  verifyCode: async (email, verificationCode) => {
    try {
      await axios.post('http://localhost:8080/api/auth/verify', { email, verificationCode });
      set({ isVerified: true });
    } catch (error) {
      console.error('Doğrulama kodu hatalı veya sistem hatası:', error);
    }
  },

  // register fonksiyonu: kullanıcıyı backend'e gönderip kaydeder
  register: async (userData) => {
    try {
      // Verinin doğru yapıda gönderildiğinden emin olalım
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        UserName: userData.UserName, 
        UserMail: userData.UserMail, 
        UserPassword: userData.UserPassword
      });
      
      set({
        user: response.data.user,
        token: response.data.token,
        isLoggedIn: true,
      });
    } catch (error) {
      console.error('Kayıt işlemi başarısız:', error);
    }
  },
  
}));
