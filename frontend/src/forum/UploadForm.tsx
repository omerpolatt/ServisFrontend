import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadForm: React.FC<{ token: string }> = ({ token }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);  // Yüklemek istediğimiz dosyayı seçiyoruz
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Lütfen bir dosya seçin.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);  // Form verisine dosyayı ekle

    try {
      const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Token'ı header'da gönderiyoruz
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Dosya başarıyla yüklendi!');
      console.log(response.data);  // Sunucudan gelen cevabı kontrol et
    } catch (error) {
      toast.error('Dosya yüklenirken bir hata oluştu.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Dosya Yükle</button>
    </form>
  );
};

export default UploadForm;
