import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie'; // js-cookie import ediyoruz

interface User {
  _id: string;
  UserName: string;
  UserMail: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
}

export const useLoginStore = create<LoginStore>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  // Login fonksiyonu
  login: async (email: string, password: string) => {
    try {
      // Backend'e login isteği
      const response = await axios.post<LoginResponse>('https://s3-space.uniworkhub.com/api/auth/login', {
        UserMail: email,
        UserPassword: password,
      });

      // Giriş başarılı olduğunda token'ı cookie'ye kaydediyoruz
      Cookies.set('token', response.data.token, { expires: 2 / 24 }); // 2 saat geçerlilik süresi

      // State güncelleniyor
      set({
        user: response.data.user,
        token: response.data.token,
        isLoggedIn: true,
      });
    } catch (error) {
      console.error('Giriş işlemi başarısız:', error);
      throw error;
    }
  },
}));
