import React, { useEffect, useState } from 'react';
import { useBucketStore } from '../stores/BucketStore';
import { TbTrashXFilled } from "react-icons/tb";


// Cookie'den token almak için yardımcı fonksiyon
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const BucketPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState<string>(''); // Yeni bucket ismi
  const [newBucketName, setNewBucketName] = useState<string>(''); // Güncellenecek bucket ismi
  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null); // Seçilen bucket ID'si
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal için state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false); // Create için Modal state
  const { createBucket, listBuckets, updateBucketName, deleteBucket, buckets, loading } = useBucketStore();

  useEffect(() => {
    const cookieToken = getCookie('token');
    if (cookieToken) {
      setToken(cookieToken);
      listBuckets(cookieToken);
    }
  }, []);

  // Bucket oluşturma butonuna tıklanıldığında çalışacak fonksiyon
  const handleCreateBucket = () => {
    if (bucketName && token) {
      createBucket(bucketName, token);
      setBucketName(''); // Bucket adı temizlenir
      setIsCreateModalOpen(false); // Modal kapatılır
    }
  };

  // Bucket adını güncelleme popup açma fonksiyonu
  const handleOpenUpdateModal = (bucketId: string) => {
    setSelectedBucketId(bucketId);
    setIsModalOpen(true);
  };

  // Bucket adını güncelleme fonksiyonu
  const handleUpdateBucketName = () => {
    if (selectedBucketId && newBucketName && token) {
      updateBucketName(selectedBucketId, newBucketName, token);
      setNewBucketName('');
      setIsModalOpen(false); // Modal kapatılır
    }
  };

  // Bucket silme fonksiyonu
  const handleDeleteBucket = (bucketId: string) => {
    if (token) {
      deleteBucket(bucketId, token);
    }
  };

  // Toggle Modal Visibility
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-200 p-8">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">Bucket Yönetimi</h1>

      {/* Oluşturma butonu */}
      <div className="flex justify-center mb-8 relative"> {/* Added relative here */}
        <button
          onClick={toggleCreateModal}  // Toggle modal on click
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Yeni Bucket Oluştur
        </button>

        {/* Yeni bucket oluşturma popup */}
        {isCreateModalOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white p-6 rounded-lg shadow-lg w-96"> {/* Positioned next to button */}
            <h3 className="text-xl font-semibold mb-4">Yeni Bucket Oluştur</h3>
            <input
              type="text"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
              placeholder="Bucket adı girin"
              className="border border-gray-300 p-2 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCreateBucket}  // Close modal on bucket creation
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Oluştur
              </button>
              <button
                onClick={toggleCreateModal}  // Close modal on cancel
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bucket Listesi */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg p-8 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Bucket Listesi</h2>
        {loading ? (
          <p className="text-center text-gray-500">Yükleniyor...</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4 font-semibold">Bucket Adı</th>
                <th className="text-left p-4 font-semibold">Oluşturma Tarihi</th>
                <th className="text-left p-4 font-semibold">Düzenle</th>
                <th className="text-left p-4 font-semibold">Sil</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket) => (
                <tr key={bucket.bucketId} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">{bucket.bucketName}</td>
                  <td className="p-4">{new Date().toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleOpenUpdateModal(bucket.bucketId)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      Düzenle
                    </button>
                  </td>
                  <td className="p-4">
                  <button
                    onClick={() => handleDeleteBucket(bucket.bucketId)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <TbTrashXFilled className="mr-2" /> {/* İkon burada */}
                    Sil
                  </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bucket adını güncelleme popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Bucket Adını Güncelle</h3>
            <input
              type="text"
              value={newBucketName}
              onChange={(e) => setNewBucketName(e.target.value)}
              placeholder="Yeni bucket adı"
              className="border border-gray-300 p-2 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={handleUpdateBucketName}
              >
                Güncelle
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BucketPage;
