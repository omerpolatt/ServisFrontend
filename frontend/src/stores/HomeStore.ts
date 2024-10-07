import { create } from 'zustand';
import axios from 'axios';

// Zustand store tipi
interface BucketState {
  bucketCreated: boolean;
  buckets: Array<{ bucketId: string; bucketName: string }>;
  error: string | null;
  loading: boolean;
  createBucket: (bucketName: string, token: string) => Promise<void>;
  listBuckets: (token: string) => Promise<void>;
  updateBucketName: (bucketId: string, newBucketName: string, token: string) => Promise<void>;
  deleteBucket: (bucketId: string, token: string) => Promise<void>;
}

// Zustand store oluşturuyoruz
export const useBucketStore = create<BucketState>((set) => ({
  bucketCreated: false,
  buckets: [],  // Başlangıçta boş liste
  error: null,
  loading: false,

  // Bucket oluşturma işlemi
  createBucket: async (bucketName, token) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        'http://localhost:8080/api/bucket/create',
        { bucketName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        set({ bucketCreated: true, error: null, loading: false });
      }
    } catch (error) {
      set({ bucketCreated: false, error: 'Bucket oluşturulurken hata oluştu.', loading: false });
    }
  },

  // Bucket listeleme işlemi
  listBuckets: async (token) => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:8080/api/bucket/list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ buckets: response.data.buckets, loading: false });
    } catch (error) {
      set({ error: 'Bucket\'lar listelenirken hata oluştu.', loading: false });
    }
  },

  // Bucket adını güncelleme işlemi
  updateBucketName: async (bucketId, newBucketName, token) => {
    set({ loading: true });
    try {
      await axios.patch(
        `http://localhost:8080/api/bucket/${bucketId}`,
        { newBucketName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ error: null, loading: false });
    } catch (error) {
      set({ error: 'Bucket adı güncellenirken hata oluştu.', loading: false });
    }
  },

  // Bucket silme işlemi
  deleteBucket: async (bucketId, token) => {
    set({ loading: true });
    try {
      await axios.delete(`http://localhost:8080/api/bucket/${bucketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ error: null, loading: false });
    } catch (error) {
      set({ error: 'Bucket silinirken hata oluştu.', loading: false });
    }
  },
}));
