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
  const [bucketName, setBucketName] = useState<string>('');  // Bucket ismi için state

  const { createBucket, bucketCreated, error } = useBucketStore();  // Zustand'dan fonksiyon ve durumlar

  // Component mount edildiğinde token'ı Cookie'den alıyoruz
  useEffect(() => {
    const cookieToken = getCookie('token');  // Cookie'den token alıyoruz
    if (cookieToken) {
      setToken(cookieToken);
      console.log("Token bulundu: ", cookieToken);  // Token'ı konsola yazdırıyoruz
    } else {
      console.error("Token bulunamadı.");
    }
  }, []);

  // Bucket oluşturma butonuna tıklanıldığında çalışacak fonksiyon
  const handleCreateBucket = () => {
    if (bucketName && token) {
      createBucket(bucketName, token);  // Zustand store'u ile bucket oluşturma isteği yapıyoruz
    } else {
      console.error("Bucket adı veya token eksik.");
    }
  };

  return (
    <div>
      <h1>Hoşgeldiniz!</h1>
      <p>Burası anasayfa.</p>

      {/* Token varsa, bucket oluşturma alanını gösteriyoruz */}
      {token ? (
        <>
          <p>Token bulundu. Bucket oluşturabilirsiniz.</p>

          <div>
            <input 
              type="text" 
              value={bucketName} 
              onChange={(e) => setBucketName(e.target.value)} 
              placeholder="Bucket ismini girin"
            />
            <button onClick={handleCreateBucket}>Bucket Oluştur</button>
          </div>

          {/* Bucket başarıyla oluşturuldu mesajı */}
          {bucketCreated && <p>Bucket başarıyla oluşturuldu!</p>}

          {/* Hata mesajı */}
          {error && <p style={{ color: 'red' }}>Hata: {error}</p>}
        </>
      ) : (
        <p>Bucket oluşturmak için giriş yapmanız gerekiyor.</p>
      )}
    </div>
  );
};

export default HomePage;
