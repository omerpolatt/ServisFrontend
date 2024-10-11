import { create } from 'zustand';
import axios from 'axios';

interface Bucket {
  bucketName: string;
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
  listBuckets: async (parentProjectAccessKey, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:8080/api/bucket/list-buckets/${parentProjectAccessKey}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Gelen verinin doğru olup olmadığını kontrol et
      console.log('Backend Response:', response.data);  // Backend'den gelen yanıtı kontrol etmek için bu satırı ekledik
  
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
  createBucket: async (parentProjectAccessKey, subFolderName, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        'http://localhost:8080/api/bucket/create-bucket',
        { parentProjectAccessKey, subFolderName },
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
