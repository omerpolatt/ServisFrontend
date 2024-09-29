import React, { useEffect, useState } from 'react';
import { useGalleryStore } from '../stores/GalleryStore';

const GalleryPage: React.FC = () => {
  const { files, uploadFile, fetchFiles, deleteFile } = useGalleryStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Seçilen dosya

  useEffect(() => {
    fetchFiles(); // Sayfa yüklendiğinde mevcut dosyaları getir
  }, [fetchFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]); // Seçilen dosyayı state'e kaydet
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadFile(selectedFile); // Seçilen dosyayı yükle
      setSelectedFile(null); // Yükleme sonrası seçimi sıfırla
    }
  };

  const handleDelete = async (filename: string) => {
    await deleteFile(filename); // Dosyayı sil
  };

  return (
    <div>
      <h1>Gallery Page</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>

      <h2>Uploaded Files</h2>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file}>
              <td>{file}</td>
              <td>
                <button onClick={() => handleDelete(file)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GalleryPage;
