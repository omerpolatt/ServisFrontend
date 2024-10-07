import { create } from 'zustand';
import axios from 'axios';

// Zustand store tipi
interface BucketState {
  buckets: { bucketId: string; bucketName: string }[];
  bucketCreated: boolean;
  error: string | null;
  loading: boolean;
  createBucket: (bucketName: string, token: string) => Promise<void>;
  listBuckets: (token: string) => Promise<void>;
  updateBucketName: (bucketId: string, newBucketName: string, token: string) => Promise<void>;
  deleteBucket: (bucketId: string, token: string) => Promise<void>;
}

// Zustand store oluşturuyoruz
export const useBucketStore = create<BucketState>((set) => ({
  buckets: [],
  bucketCreated: false,
  error: null,
  loading: false,

  // Bucket oluşturma işlemi
  createBucket: async (bucketName, token) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        'http://localhost:8080/api/bucket/create', 
        { bucketName },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Token ekleniyor
          },
        }
      );
      if (response.status === 200) {
        set({ bucketCreated: true, error: null });
      }
    } catch (error) {
      console.error('Bucket oluşturulamadı:', error);
      set({ bucketCreated: false, error: 'Bucket oluşturulurken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },

  // Bucket listeleme işlemi
  listBuckets: async (token) => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:8080/api/bucket/list', {
        headers: {
          Authorization: `Bearer ${token}`,  // Token ekleniyor
        },
      });
      set({ buckets: response.data.buckets, error: null });
    } catch (error) {
      console.error('Bucket\'lar listelenemedi:', error);
      set({ error: 'Bucket\'lar listelenirken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },

  // Bucket adı güncelleme işlemi
  updateBucketName: async (bucketId, newBucketName, token) => {
    set({ loading: true });
    try {
      await axios.patch(
        `http://localhost:8080/api/bucket/${bucketId}`,
        { newBucketName },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Token ekleniyor
          },
        }
      );
      set({ error: null });
      // Listeyi tekrar güncelleyin
    } catch (error) {
      console.error('Bucket adı güncellenemedi:', error);
      set({ error: 'Bucket adı güncellenirken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },

  // Bucket silme işlemi
  deleteBucket: async (bucketId, token) => {
    set({ loading: true });
    try {
      await axios.delete(`http://localhost:8080/api/bucket/${bucketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Token ekleniyor
        },
      });
      set({ error: null });
      // Listeyi tekrar güncelleyin
    } catch (error) {
      console.error('Bucket silinemedi:', error);
      set({ error: 'Bucket silinirken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },
}));
