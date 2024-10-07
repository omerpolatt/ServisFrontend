import React, { useEffect, useState } from 'react';
import { useBucketStore } from '../stores/HomeStore';  // Zustand store import edildi

// Cookie'den token almak için yardımcı fonksiyon
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const HomePage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState<string>('');  // Yeni bucket ismi
  const [newBucketName, setNewBucketName] = useState<string>('');  // Güncellenecek bucket ismi
  const { createBucket, listBuckets, updateBucketName, deleteBucket, bucketCreated, buckets, error, loading } = useBucketStore();  // Zustand'dan fonksiyon ve durumlar

  // Component mount edildiğinde token'ı Cookie'den alıyoruz ve bucket listesi çekiliyor
  useEffect(() => {
    const cookieToken = getCookie('token');
    if (cookieToken) {
      setToken(cookieToken);
      listBuckets(cookieToken);  // Bucket'ları listele
    }
  }, []);

  // Bucket oluşturma butonuna tıklanıldığında çalışacak fonksiyon
  const handleCreateBucket = () => {
    if (bucketName && token) {
      createBucket(bucketName, token);
    }
  };

  // Bucket adını güncelleme fonksiyonu
  const handleUpdateBucketName = (bucketId: string) => {
    if (newBucketName && token) {
      updateBucketName(bucketId, newBucketName, token);
    }
  };

  // Bucket silme fonksiyonu
  const handleDeleteBucket = (bucketId: string) => {
    if (token) {
      deleteBucket(bucketId, token);
    }
  };

  return (
    <div>
      <h1>Hoşgeldiniz!</h1>
      <p>Burası anasayfa.</p>

      {/* Bucket oluşturma alanı */}
      {token && (
        <>
          <input 
            type="text" 
            value={bucketName} 
            onChange={(e) => setBucketName(e.target.value)} 
            placeholder="Bucket ismini girin" 
          />
          <button onClick={handleCreateBucket} disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Bucket Oluştur'}
          </button>

          {bucketCreated && <p style={{ color: 'green' }}>Bucket başarıyla oluşturuldu!</p>}
          {error && <p style={{ color: 'red' }}>Hata: {error}</p>}
        </>
      )}

      {/* Bucket listesi */}
      <h2>Kullanıcıya Ait Bucket'lar</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        buckets.map((bucket) => (
          <div key={bucket.bucketId}>
            <p>{bucket.bucketName}</p>
            <input
              type="text"
              value={newBucketName}
              onChange={(e) => setNewBucketName(e.target.value)}
              placeholder="Yeni bucket adı"
            />
            <button onClick={() => handleUpdateBucketName(bucket.bucketId)}>Adı Güncelle</button>
            <button onClick={() => handleDeleteBucket(bucket.bucketId)}>Sil</button>
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;
