import { create } from 'zustand';
import axios from 'axios';
interface UploadedFile {
  _id: string;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  bucketId: string;
  uploadedAt: Date;
}
interface FileStore {
  files: UploadedFile[];
  loading: boolean;
  error: string | null;
  getAccessKey: (bucketId: string, token: string) => Promise<string | null>;
  listFiles: (accessKey: string, token: string) => Promise<void>;
  uploadFile: (accessKey: string, file: File, token: string) => Promise<void>;
  deleteFile: (fileId: string, accessKey: string, token: string) => Promise<void>;
}
export const useFileStore = create<FileStore>((set) => ({
  files: [],
  loading: false,
  error: null,
  // Bucket ID ile AccessKey alma
  getAccessKey: async (bucketId, token: string) => {
    try {
      const response = await axios.get(`http://tkk04oksokwwgwswgg84cg4w.5.253.143.162.sslip.io/api/files/buckets/accessKey/${bucketId}`, {
        headers: { Authorization: `Bearer ${token}` },  // Token yetkilendirme başlığıyla gönderiliyor
      });
      return response.data.accessKey;
    } catch (error) {
      console.error("AccessKey alınırken hata oluştu:", error);
      return null;
    }
  },
  // Dosya listeleme - accessKey ve token kullanarak
  listFiles: async (accessKey, token: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://tkk04oksokwwgwswgg84cg4w.5.253.143.162.sslip.io/api/files/files/${accessKey}`, {
        headers: { Authorization: `Bearer ${token}` },  // Token yetkilendirme başlığı
      });
      set({ files: response.data.files, loading: false });
    } catch (error) {
      console.error("Dosyalar listelenemedi:", error);
      set({ error: 'Dosyalar listelenemedi.', loading: false });
    }
  },
  // Dosya yükleme - accessKey ve token kullanarak
  uploadFile: async (accessKey, file: File, token: string) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('accessKey', accessKey);
      const response = await axios.post(
        `http://tkk04oksokwwgwswgg84cg4w.5.253.143.162.sslip.io/api/files/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Token yetkilendirme başlığı
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      set((state) => ({
        files: [...state.files, response.data.file],
        loading: false,
      }));
    } catch (error) {
      console.error("Dosya yüklenemedi:", error);
      set({ error: 'Dosya yüklenemedi.', loading: false });
    }
  },
  // Dosya silme - accessKey ve fileId kullanarak
  deleteFile: async (fileId: string, accessKey: string, token: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`http://tkk04oksokwwgwswgg84cg4w.5.253.143.162.sslip.io/api/files/${accessKey}/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        files: state.files.filter((file) => file._id !== fileId),
        loading: false,
      }));
    } catch (error) {
      console.error('Dosya silinemedi:', error);
      set({ error: 'Dosya silinemedi.', loading: false });
    }
  },
}));