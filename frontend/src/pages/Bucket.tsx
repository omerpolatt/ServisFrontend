import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TbTrashXFilled } from "react-icons/tb";
import { useBucketStore } from '../stores/BucketStore';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const BucketPage: React.FC = () => {
  const { parentProjectId } = useParams<{ parentProjectId: string }>(); 
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState<string>('');
  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);
  const [selectedBucketName, setSelectedBucketName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState<string>('');

  const {
    listBuckets,
    createBucket,
    deleteBucket,
    updateBucketName,
    buckets = [],
    loading,
    error,
  } = useBucketStore();

  useEffect(() => {
    const cookieToken = getCookie('token');
    console.log('Token:', cookieToken);  // Token'ı kontrol edin
    console.log('Parent Project ID:', parentProjectId);  // parentProjectId'yi kontrol edin
    if (cookieToken && parentProjectId) {
      setToken(cookieToken);
      listBuckets(parentProjectId, cookieToken).catch(console.error);
    } else {
      console.error('Token veya parentProjectId eksik.');
    }
  }, [parentProjectId]);
  

  const handleCreateBucket = async () => {
    if (bucketName && parentProjectId && token) {
      await createBucket(parentProjectId, bucketName, token);
      setBucketName('');
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteBucket = async () => {
    if (token && selectedBucketId) {
      await deleteBucket(selectedBucketId, token);
      setIsDeleteModalOpen(false);
      setDeleteConfirmName('');
    }
  };

  const handleUpdateBucketName = async () => {
    if (selectedBucketId && bucketName && token) {
      await updateBucketName(selectedBucketId, bucketName, token);
      setBucketName('');
      setIsModalOpen(false);
    }
  };

  const openDeleteModal = (bucketId: string, bucketName: string) => {
    setSelectedBucketId(bucketId);
    setSelectedBucketName(bucketName);
    setIsDeleteModalOpen(true);
  };

  const handleViewFiles = (bucketId: string) => {
    navigate(`/bucket/files/${bucketId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Bucket Yönetimi</h2>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Yeni Bucket Oluştur
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Yükleniyor...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full border-collapse text-gray-700">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="text-left p-4 font-semibold">Bucket Adı</th>
                <th className="text-left p-4 font-semibold">Dosyaları Gör</th>
                <th className="text-left p-4 font-semibold">Sil</th>
              </tr>
            </thead>
            <tbody>
              {buckets && buckets.length > 0 ? (
                buckets.map((bucket) => (
                  <tr key={bucket._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-800 font-medium">{bucket.subFolderName}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewFiles(bucket._id)}
                        className="text-blue-500 font-semibold hover:text-blue-700 flex items-center"
                      >
                        Dosyaları Gör
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => openDeleteModal(bucket._id, bucket.subFolderName)}
                        className="text-red-500 font-semibold hover:text-red-700 flex items-center"
                      >
                        <TbTrashXFilled className="mr-2" /> Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">Bucket bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Silme doğrulama modalı */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Bucket Sil</h3>
              <p className="mb-4">"{selectedBucketName}" bucketini silmek için bucket adını yazın:</p>
              <input
                type="text"
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                placeholder="Bucket Adını Girin"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleDeleteBucket}
                  disabled={deleteConfirmName !== selectedBucketName}
                  className={`${
                    deleteConfirmName === selectedBucketName
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white font-semibold py-2 px-6 rounded-lg shadow-md`}
                >
                  Sil
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow-md"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bucket oluşturma modalı */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Yeni Bucket Oluştur</h3>
              <input
                type="text"
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                placeholder="Yeni Bucket Adı"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCreateBucket}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
                >
                  Oluştur
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow-md"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Güncelleme modalı */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Bucket Adını Güncelle</h3>
              <input
                type="text"
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                placeholder="Yeni bucket adı"
                className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleUpdateBucketName}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow-md"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BucketPage;
