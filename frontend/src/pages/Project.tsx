import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../stores/ProjectStore';
import { useNavigate } from 'react-router-dom';
import { TbTrashXFilled } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Cookie'den token almak için yardımcı fonksiyon
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const ProjectPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>(''); // Yeni project ismi
  const [newProjectName, setNewProjectName] = useState<string>(''); // Güncellenecek project ismi
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null); // Seçilen project ID'si
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal için state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false); // Create için Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); // Silme onayı modalı
  const [deleteConfirmProjectId, setDeleteConfirmProjectId] = useState<string | null>(null);  // Silinecek proje ID
  const [deleteConfirmProjectName, setDeleteConfirmProjectName] = useState<string>('');  // Silinecek proje adı
  const [confirmProjectName, setConfirmProjectName] = useState<string>(''); // Doğrulama için kullanıcı tarafından girilen ad
  const { createProject, listProjects, updateProjectName, deleteProject, projects, loading } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    const cookieToken = getCookie('token');
    if (cookieToken) {
      setToken(cookieToken);
      listProjects(cookieToken).then(() => {});
    }
  }, []);

  // Proje oluşturma fonksiyonu
  const handleCreateProject = async () => {
    if (projectName && token) {
      await createProject(projectName, token); // Proje oluşturuluyor
      setProjectName(''); // Project adı temizlenir
      setIsCreateModalOpen(false); // Modal kapatılır
      toast.success('Proje başarıyla oluşturuldu!', { position: 'top-right' }); // Başarı mesajı
    } else {
      toast.error('Proje adı boş olamaz!', { position: 'top-right' }); // Hata mesajı
    }
  };

  // Proje adını güncelleme modalını açma fonksiyonu
  const handleOpenUpdateModal = (projectId: string, currentProjectName: string) => {
    setSelectedProjectId(projectId);
    setNewProjectName(currentProjectName); // Eski proje adını input'a doldur
    setIsModalOpen(true);
  };

  // Proje adını güncelleme fonksiyonu
  const handleUpdateProjectName = async () => {
    if (selectedProjectId && newProjectName && token) {
      await updateProjectName(selectedProjectId, newProjectName, token);
      setNewProjectName(''); // Yeni adı sıfırla
      setIsModalOpen(false); // Modal'ı kapat
      toast.success('Proje adı başarıyla güncellendi!', { position: 'top-right' }); // Başarı mesajı
    } else {
      toast.error('Eksik veri: Proje ID veya yeni proje adı eksik.', { position: 'top-right' });
    }
  };

  // Silme onayı modalını açma fonksiyonu
  const openDeleteModal = (projectId: string, projectName: string) => {
    setDeleteConfirmProjectId(projectId);
    setDeleteConfirmProjectName(projectName); // Doğrulama için proje adını set ediyoruz
    setIsDeleteModalOpen(true);
  };

  // Proje silme fonksiyonu (onaylı)
  const handleDeleteProject = async () => {
    if (deleteConfirmProjectId && token && confirmProjectName === deleteConfirmProjectName) {
      await deleteProject(deleteConfirmProjectId, token);
      setIsDeleteModalOpen(false);
      setDeleteConfirmProjectId(null);
      setDeleteConfirmProjectName('');
      setConfirmProjectName('');
      toast.success('Proje başarıyla silindi!', { position: 'top-right' }); // Başarı mesajı
    } else {
      toast.error('Proje adı doğrulaması hatalı.', { position: 'top-right' }); // Hata mesajı
    }
  };

  // Yönlendirme işlemi: Proje adına tıklandığında bucket'lara yönlendirir
  const handleViewBuckets = (projectId: string) => {
    navigate(`/project/${projectId}`); // Bucket sayfasına yönlendirilir
  };

  // Modal toggle
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // Popup dışında bir yere tıklandığında kapanmasını sağlama
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setIsCreateModalOpen(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-200 p-8">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">Proje Yönetimi</h1>

      {/* Yeni Proje Oluştur Butonu */}
      <div className="flex justify-center mb-8 relative">
        <button
          onClick={toggleCreateModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Yeni Proje Oluştur
        </button>

        {/* Proje oluşturma popup */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-20" onClick={handleClickOutside}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Yeni Proje Oluştur</h3>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Proje adı girin"
                className="border border-gray-300 p-2 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCreateProject}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Oluştur
                </button>
                <button
                  onClick={toggleCreateModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proje Listesi */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg p-8 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Proje Listesi</h2>
        {loading ? (
          <p className="text-center text-gray-500">Yükleniyor...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Proje Adı</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Oluşturma Tarihi</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Düzenle</th>
                  <th className="p-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Sil</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.projectId}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                  >
                    {/* Proje adına tıklanınca bucket'ları gösterecek */}
                    <td
                      className="p-4 text-sm text-gray-700 font-semibold cursor-pointer hover:text-blue-600 transition-all duration-200"
                      onClick={() => handleViewBuckets(project.projectId)}
                    >
                      {project.projectName}
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date().toLocaleDateString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleOpenUpdateModal(project.projectId, project.projectName)} // Proje adını da gönderiyoruz
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Düzenle
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => openDeleteModal(project.projectId, project.projectName)}
                        className="text-red-500 hover:text-red-700 flex items-center font-medium"
                      >
                        <TbTrashXFilled className="mr-2" /> Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Silme doğrulama modalı */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20" onClick={handleClickOutside}>
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Proje Sil</h3>
            <p className="mb-4">"{deleteConfirmProjectName}" projesini silmek için proje adını yazın:</p>
            <input
              type="text"
              value={confirmProjectName}
              onChange={(e) => setConfirmProjectName(e.target.value)}
              placeholder="Proje Adını Girin"
              className="border border-gray-300 p-3 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteProject}
                disabled={confirmProjectName !== deleteConfirmProjectName}
                className={`${
                  confirmProjectName === deleteConfirmProjectName
                    ? "bg-red-500 hover:bg-red-600"
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

      {/* Proje adını güncelleme modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20" onClick={handleClickOutside}>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Proje Adını Güncelle</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Yeni proje adı"
              className="border border-gray-300 p-2 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={handleUpdateProjectName}
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

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default ProjectPage;
