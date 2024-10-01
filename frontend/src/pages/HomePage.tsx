import React, { useEffect, useState } from 'react';
import UploadForm from '../forum/UploadForm';  // Dosya yükleme formu bileşeni

// Cookie'den token almak için yardımcı fonksiyon
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const HomePage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

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

  return (
    <div>
      <h1>Hoşgeldiniz!</h1>
      <p>Burası anasayfa.</p>

      {/* Token varsa, dosya yükleme formunu gösteriyoruz */}
      {token ? (
        <>
          <p>Token bulundu. Dosya yükleyebilirsiniz.</p>
          <UploadForm token={token} />
        </>
      ) : (
        <p>Dosya yüklemek için giriş yapmanız gerekiyor.</p>
      )}
    </div>
  );
};

export default HomePage;
