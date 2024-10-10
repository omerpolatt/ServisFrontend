// store/filesStore.ts
import { create } from 'zustand';
import axios from 'axios';

interface File {
  _id: string;
  fileName: string;
  fileType: string;
  subfolderId: string;
  uploadedAt: Date;  // Yeni alan eklendi
}

interface FileStore {
  files: File[];
  loading: boolean;
  error: string | null;
  listFiles: (subfolderId: string, token: string) => Promise<void>;
  createFile: (subfolderId: string, fileName: string, fileType: string, token: string) => Promise<void>;
  updateFileName: (fileId: string, newFileName: string, token: string) => Promise<void>;
  deleteFile: (fileId: string, token: string) => Promise<void>;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  loading: false,
  error: null,

  // Dosyaları alt klasöre göre listeleme
  listFiles: async (subfolderId, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:8080/api/files/files/${subfolderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ files: response.data.files, loading: false });
    } catch (error) {
      console.error("Dosyalar listelenemedi:", error);
      set({ error: 'Dosyalar listelenemedi.', loading: false });
    }
  },

  // Yeni dosya oluşturma
  createFile: async (subfolderId, fileName, fileType, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `http://localhost:8080/api/files/create-file`,
        { fileName, fileType, subfolderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        files: [...state.files, response.data.file],
        loading: false,
      }));
    } catch (error) {
      console.error("Dosya oluşturulamadı:", error);
      set({ error: 'Dosya oluşturulamadı.', loading: false });
    }
  },

  // Dosya adı güncelleme
  updateFileName: async (fileId, newFileName, token) => {
    set({ loading: true, error: null });
    try {
      await axios.put(
        `http://localhost:8080/api/files/update/${fileId}`,
        { newFileName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        files: state.files.map((file) =>
          file._id === fileId ? { ...file, fileName: newFileName } : file
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Dosya adı güncellenemedi:", error);
      set({ error: 'Dosya adı güncellenemedi.', loading: false });
    }
  },

  // Dosya silme
  deleteFile: async (fileId, token) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`http://localhost:8080/api/files/delete-file`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        files: state.files.filter((file) => file._id !== fileId),
        loading: false,
      }));
    } catch (error) {
      console.error("Dosya silinemedi:", error);
      set({ error: 'Dosya silinemedi.', loading: false });
    }
  },
}));