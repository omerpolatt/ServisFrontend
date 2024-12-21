import { create } from 'zustand';
import axios from 'axios';

interface Bucket {
  bucketName: string;
  _id: string;
  accessKey: string;
  projectId: string;
  path: string;
  totalSizeMB?: string;
} 

interface UploadedFile {
  _id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  accessKey: string;
  uploadedAt: string;
}


interface BucketStore {
  buckets: Bucket[];
  loading: boolean;
  error: string | null;
  listBuckets: (projectId: string, token: string) => Promise<void>; // Virgül önemli
  createBucket: (projectId: string, bucketName: string, token: string) => Promise<void>;
  updateBucketName: (bucketId: string, newBucketName: string, token: string) => Promise<void>;
  deleteBucket: (bucketId: string, token: string) => Promise<void>;
}


export const useBucketStore = create<BucketStore>((set) => ({
  buckets: [],
  loading: false,
  error: null,

  // Bucket listeleme işlemi
  listBuckets: async (parentProjectId: string, token: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`https://s3-space.uniworkhub.com/api/bucket/list-buckets/${parentProjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.buckets) {
        const buckets = response.data.buckets;

        // Her bucket için dosya boyutunu hesapla
        const bucketsWithSizes = await Promise.all(buckets.map(async (bucket: Bucket) => {
          try {
            const filesResponse = await axios.get(`https://s3-space.uniworkhub.com/api/files/files/${bucket.accessKey}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
        
            if (filesResponse.data && filesResponse.data.files) {
              const totalSizeInMB = (filesResponse.data.files.reduce((acc: number, file: UploadedFile) => acc + file.fileSize, 0) / (1024 * 1024)).toFixed(2);
              return {
                ...bucket,
                totalSizeMB: totalSizeInMB,
              };
            } else {
              return bucket;
            }
          } catch (error) {
            console.error('Dosyalar alınamadı:', error);
            return bucket;
          }
        }));
        

        set({ buckets: bucketsWithSizes, loading: false });
      } else {
        set({ error: 'Beklenen veri formatı bulunamadı.', loading: false });
      }
    } catch (error) {
      console.error('Bucket listesi alınamadı:', error);
      set({ error: 'Bucket listesi alınırken bir hata oluştu.', loading: false });
    }
  }, 

  // Bucket oluşturma işlemi
  createBucket: async (projectId, bucketName, token) => {
    set({ loading: true, error: null });
    try {
      console.log("Bucket Oluşturma İsteği - Project ID:", projectId);
      console.log("Bucket Oluşturma İsteği - Bucket Name:", bucketName);
      const response = await axios.post(
        'https://s3-space.uniworkhub.com/api/bucket/create-bucket',
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
        `https://s3-space.uniworkhub.com/api/bucket/update/${bucketId}`,
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
      await axios.delete(`https://s3-space.uniworkhub.com/api/bucket/delete-bucket/${bucketId}`, {
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