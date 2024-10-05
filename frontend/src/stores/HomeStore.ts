import { create } from 'zustand';
import axios from 'axios';

// Zustand store tipi
interface BucketState {
  bucketCreated: boolean;
  error: string | null;
  createBucket: (bucketName: string, token: string) => Promise<void>;
}

// Zustand store oluşturuyoruz
export const useBucketStore = create<BucketState>((set) => ({
  bucketCreated: false,
  error: null,

  // Bucket oluşturma işlemi
  createBucket: async (bucketName, token) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/api/bucket/create',  // Backend'deki rota
            { bucketName },  // Gönderilen veri
            {
              headers: {
                Authorization: `Bearer ${token}`,  // Token'i Authorization başlığına ekliyoruz
              },
            }
          );

      if (response.status === 200) {
        set({ bucketCreated: true, error: null });  // Başarılı olursa state güncelleniyor
      }
    } catch (error) {
      console.error("Bucket oluşturulamadı:", error);
      set({ bucketCreated: false, error: 'Bucket oluşturulurken hata oluştu.' });
    }
  },
}));
