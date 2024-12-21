import { create } from 'zustand';
import axios from 'axios';

// Store tipi
interface GalleryState {
  files: string[];
  uploadFile: (file: File) => Promise<void>;
  fetchFiles: () => Promise<void>;
  deleteFile: (filename: string) => Promise<void>;
}

// Token'ı cookie'den alalım (Veya localStorage'dan da alabilirsiniz)
const getToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
}

// Store oluşturma
export const useGalleryStore = create<GalleryState>((set) => ({
  files: [],

  // Dosya yükleme fonksiyonu
  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file); // Dosya ekleniyor

      const token = getToken(); // Token'ı alıyoruz

      // Dosya yükleme isteği
      await axios.post('https://s3-space.uniworkhub.com/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Token'ı ekliyoruz
        },
      });
      
      // Yükleme sonrası dosyaları tekrar al (isteğe bağlı)
      set((state) => ({
        files: [...state.files, file.name], // Yüklenen dosya ismini ekleyelim
      }));
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
    }
  },

  // Kullanıcının dosyalarını listeleme fonksiyonu
  fetchFiles: async () => {
    try {
      const token = getToken(); // Token'ı alıyoruz

      const response = await axios.get('https://s3-space.uniworkhub.com/api/files', {
        headers: {
          'Authorization': `Bearer ${token}`, // Token'ı ekliyoruz
        },
      });
      set({ files: response.data.files });
    } catch (error) {
      console.error('Dosyalar getirilirken hata oluştu:', error);
    }
  },

  // Dosya silme fonksiyonu
  deleteFile: async (filename: string) => {
    try {
      const token = getToken(); // Token'ı alıyoruz

      await axios.delete(`https://s3-space.uniworkhub.com/api/files/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Token'ı ekliyoruz
        },
      });
      set((state) => ({
        files: state.files.filter((file) => file !== filename),
      }));
    } catch (error) {
      console.error('Dosya silinirken hata oluştu:', error);
    }
  },
}));
