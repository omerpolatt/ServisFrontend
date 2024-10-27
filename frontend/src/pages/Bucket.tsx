import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TbTrashXFilled, TbInfoCircle, TbClipboard } from "react-icons/tb";
import { useBucketStore } from '../stores/BucketStore';
import { useProjectStore } from '../stores/ProjectStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [selectedBucketDetails, setSelectedBucketDetails] = useState<{
    link: string | null; name: string; projectName: string; accessKey: string; totalSizeMB?: string;
  } | null>(null);
  const [projectName, setProjectName] = useState<string>("");

  const {
    listBuckets,
    createBucket,
    deleteBucket,
    updateBucketName,
    buckets = [],
    loading,
    error,
  } = useBucketStore();

  const { projects, listProjects } = useProjectStore();

  useEffect(() => {
    const cookieToken = getCookie('token');
    if (cookieToken && parentProjectId) {
      setToken(cookieToken);
      listProjects(cookieToken).then(() => {
        const project = projects.find((proj) => proj.projectId === parentProjectId);
        setProjectName(project ? project.projectName : "Proje Adı Bulunamadı");
      }).catch(console.error);
      listBuckets(parentProjectId, cookieToken).catch(console.error);
    } else {
      console.error('Token veya parentProjectId eksik.');
    }
  }, [parentProjectId, listProjects, listBuckets]);

  const handleCreateBucket = async () => {
    if (bucketName && parentProjectId && token) {
      await createBucket(parentProjectId, bucketName, token);
      setBucketName('');
      setIsCreateModalOpen(false);
      listBuckets(parentProjectId, token);
      toast.success('Bucket başarıyla oluşturuldu!', { position: 'top-right' });
    } else {
      toast.error('Bucket adı girilmelidir!', { position: 'top-right' });
    }
  };

  const handleDeleteBucket = async () => {
    if (token && selectedBucketId) {
      await deleteBucket(selectedBucketId, token);
      setIsDeleteModalOpen(false);
      setDeleteConfirmName('');
      listBuckets(parentProjectId!, token);
      toast.success('Bucket başarıyla silindi!', { position: 'top-right' });
    }
  };

  const handleUpdateBucketName = async () => {
    if (selectedBucketId && bucketName && token) {
      await updateBucketName(selectedBucketId, bucketName, token);
      setBucketName('');
      setIsModalOpen(false);
      listBuckets(parentProjectId!, token);
      toast.success('Bucket adı başarıyla güncellendi!', { position: 'top-right' });
    } else {
      toast.error('Yeni bucket adı girilmelidir!', { position: 'top-right' });
    }
  };

  const openDeleteModal = (bucketId: string, bucketName: string) => {
    setSelectedBucketId(bucketId);
    setSelectedBucketName(bucketName);
    setIsDeleteModalOpen(true);
  };

  const handleViewFiles = (bucketId: string) => {
    navigate(`/bucket/${bucketId}`);
  };

  const openInfoModal = (bucket: any) => {
    setSelectedBucketDetails({
      name: bucket.bucketName,
      projectName: projectName || "Proje Adı Belirtilmemiş",
      accessKey: bucket.accessKey || "Erişim Anahtarı Belirtilmemiş",
      link: "http://tkk04oksokwwgwswgg84cg4w.5.253.143.162.sslip.io/s3Space",
      totalSizeMB: bucket.totalSizeMB || "0" // Toplam boyut
    });
    setIsInfoModalOpen(true);
  };

  // Kopyalama fonksiyonu
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Bilgiler kopyalandı!', { position: 'top-right' });
    }).catch(() => toast.error('Kopyalama hatası', { position: 'top-right' }));
  };

  const handleModalClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setIsCreateModalOpen(false);
      setIsDeleteModalOpen(false);
      setIsInfoModalOpen(false);
    }
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
                <th className="text-left p-4 font-semibold">Toplam Boyut (MB)</th>
                <th className="text-left p-4 font-semibold">Doluluk Oranı</th>
                <th className="text-left p-4 font-semibold">Bilgi</th>
                <th className="text-center p-4 font-semibold">Dosyaları Gör</th>
                <th className="text-left p-4 font-semibold">Sil</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket) => {
                const totalSizeMB = bucket.totalSizeMB ? parseFloat(bucket.totalSizeMB) : 0; // Toplam boyut
                const maxSizeMB = 2048; // 2 GB = 2048 MB
                const usagePercentage = (totalSizeMB / maxSizeMB) * 100; // Kullanım oranı hesaplama

                return (
                  <tr key={bucket._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-800 font-medium align-middle">{bucket.bucketName}</td>
                    <td className="p-4 text-gray-800 font-medium align-middle">{totalSizeMB} MB</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center">
                        <div className="w-1/2 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${usagePercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{usagePercentage.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-center align-middle">
                      <button
                        onClick={() => openInfoModal(bucket)}
                        className="flex justify-center items-center text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <TbInfoCircle className="text-base" />
                        <span>Bilgi</span>
                      </button>
                    </td>
                    <td className="p-4 text-center align-middle">
                      <button
                        onClick={() => handleViewFiles(bucket._id)}
                        className="text-blue-500 font-semibold hover:text-blue-700"
                      >
                        Dosyaları Gör
                      </button>
                    </td>
                    <td className="p-4 text-center align-middle">
                      <button
                        onClick={() => openDeleteModal(bucket._id, bucket.bucketName)}
                        className="text-red-500 font-semibold hover:text-red-700 flex items-center justify-center"
                      >
                        <TbTrashXFilled className="mr-1" /> Sil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {/* Info Modal */}
        {isInfoModalOpen && selectedBucketDetails && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20" onClick={handleModalClickOutside}>
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full relative">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Bucket Hakkında</h3>
              <p className="mb-4">BUCKET_NAME: <strong>{selectedBucketDetails.name}</strong></p>
              <p className="mb-4">Project: <strong>{selectedBucketDetails.projectName}</strong></p>
              <p className="mb-4">ACCESS_KEY: <strong className="break-words">{selectedBucketDetails.accessKey}</strong></p>
              <p className="mb-4">Link: {selectedBucketDetails.link}</p>
              <button
                onClick={() => {
                  const dataToCopy = `BUCKET_NAME: ${selectedBucketDetails.name}\nProject: ${selectedBucketDetails.projectName}\nACCESS_KEY: ${selectedBucketDetails.accessKey}\nToplam Boyut: ${selectedBucketDetails.totalSizeMB} MB\nLink: ${selectedBucketDetails.link || "Henüz bir link yok"}`;
                  copyToClipboard(dataToCopy);
                }}
                className="absolute top-4 right-4 p-2 bg-blue-600 hover:bg-blue-600 text-white rounded-full shadow-lg"
              >
                <TbClipboard className="text-xl" />
              </button>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsInfoModalOpen(false)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Diğer modallar */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20" onClick={handleModalClickOutside}>
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
                  className={`${deleteConfirmName === selectedBucketName
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
        {/* Create Bucket Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20" onClick={handleModalClickOutside}>
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
        {/* Update Bucket Name Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20" onClick={handleModalClickOutside}>
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
      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default BucketPage;