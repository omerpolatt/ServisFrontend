import { create } from 'zustand';
import axios from 'axios';

interface Bucket {
  _id: string;
  subFolderName: string;
  accessKey: string;
  bucketId: string;
  path: string;
}

interface BucketStore {
  buckets: Bucket[];
  loading: boolean;
  error: string | null;
  listBuckets: (projectId: string, token: string) => Promise<void>;
  createBucket: (projectId: string, subFolderName: string, token: string) => Promise<void>;
  updateBucketName: (bucketId: string, newBucketName: string, token: string) => Promise<void>;
  deleteBucket: (bucketId: string, token: string) => Promise<void>;
}

export const useBucketStore = create<BucketStore>((set) => ({
  buckets: [],
  loading: false,
  error: null,

  // Bucket listeleme işlemi
  listBuckets: async (projectId, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:8080/api/bucket/list-buckets/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ buckets: response.data.buckets, loading: false });
    } catch (error) {
      console.error('Klasörler listelenemedi:', error);
      set({ error: 'Klasörler listelenemedi.', loading: false });
    }
  },

  // Bucket oluşturma işlemi
  createBucket: async (projectId, subFolderName, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        'http://localhost:8080/api/bucket/create-bucket',
        { projectId, subFolderName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        buckets: [...state.buckets, response.data.bucket],
        loading: false,
      }));
    } catch (error) {
      console.error('Klasör oluşturulamadı:', error);
      set({ error: 'Klasör oluşturulamadı.', loading: false });
    }
  },

  // Bucket adı güncelleme işlemi
  updateBucketName: async (bucketId, newBucketName, token) => {
    set({ loading: true, error: null });
    try {
      await axios.put(
        `http://localhost:8080/api/bucket/update/${bucketId}`,
        { newBucketName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        buckets: state.buckets.map((bucket) =>
          bucket._id === bucketId
            ? { ...bucket, subFolderName: newBucketName }
            : bucket
        ),
        loading: false,
      }));
    } catch (error) {
      console.error('Klasör adı güncellenemedi:', error);
      set({ error: 'Klasör adı güncellenirken hata oluştu.', loading: false });
    }
  },

  // Bucket silme işlemi
  deleteBucket: async (bucketId, token) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`http://localhost:8080/api/bucket/delete-bucket/${bucketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        buckets: state.buckets.filter((bucket) => bucket._id !== bucketId),
        loading: false,
      }));
    } catch (error) {
      console.error('Klasör silinemedi:', error);
      set({ error: 'Klasör silinirken hata oluştu.', loading: false });
    }
  },
}));
