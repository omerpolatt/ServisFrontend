import { create } from 'zustand';
import axios from 'axios';

interface Bucket {
  bucketName: string;
  _id: string;
  accessKey: string;
  projectId: string;
  path: string;
}

interface BucketStore {
  buckets: Bucket[];
  loading: boolean;
  error: string | null;
  listBuckets: (projectId: string, token: string) => Promise<void>;
  createBucket: (projectId: string, bucketName: string, token: string) => Promise<void>;
  updateBucketName: (bucketId: string, newBucketName: string, token: string) => Promise<void>;
  deleteBucket: (bucketId: string, token: string) => Promise<void>;
}

export const useBucketStore = create<BucketStore>((set) => ({
  buckets: [],
  loading: false,
  error: null,

  // Bucket listeleme işlemi
  listBuckets: async (parentProjectId, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:8080/api/bucket/list-buckets/${parentProjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data && response.data.buckets) {
        set({ buckets: response.data.buckets, loading: false });
      } else {
        set({ error: 'Gelen veri beklenen formatta değil.', loading: false });
      }
    } catch (error) {
      console.error('Klasörler listelenemedi:', error);
      set({ error: 'Klasörler listelenemedi.', loading: false });
    }
  },
  

  // Bucket oluşturma işlemi
  createBucket: async (projectId, bucketName, token) => {
    set({ loading: true, error: null });
    try {
      console.log("Bucket Oluşturma İsteği - Project ID:", projectId);
      console.log("Bucket Oluşturma İsteği - Bucket Name:", bucketName);
      const response = await axios.post(
        'http://localhost:8080/api/bucket/create-bucket',
        { projectId, bucketName },
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
            ? { ...bucket, bucketName: newBucketName }
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
