import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../stores/ProjectStore';
import { useNavigate } from 'react-router-dom';  // Yönlendirme için kullanıyoruz
import { TbTrashXFilled } from "react-icons/tb";

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
  const { createProject, listProjects, updateProjectName, deleteProject, projects, loading } = useProjectStore();
  const navigate = useNavigate();  // Yönlendirme için useNavigate

  useEffect(() => {
    const cookieToken = getCookie('token');
    if (cookieToken) {
      setToken(cookieToken);
      listProjects(cookieToken);
    }
  }, []);

  // Project oluşturma butonuna tıklanıldığında çalışacak fonksiyon
  const handleCreateProject = async () => {
    if (projectName && token) {
      await createProject(projectName, token); // Proje oluşturuluyor
      setProjectName(''); // Project adı temizlenir
      setIsCreateModalOpen(false); // Modal kapatılır
    }
  };

  // Project adını güncelleme popup açma fonksiyonu
  const handleOpenUpdateModal = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsModalOpen(true);
  };

  // Project adını güncelleme fonksiyonu
  const handleUpdateProjectName = () => {
    if (selectedProjectId && newProjectName && token) {
      updateProjectName(selectedProjectId, newProjectName, token);
      setNewProjectName('');
      setIsModalOpen(false); // Modal kapatılır
    }
  };

  // Project silme fonksiyonu
  const handleDeleteProject = (projectId: string) => {
    if (token) {
      deleteProject(projectId, token);
    }
  };

  // Yönlendirme işlemi: Proje adına tıklandığında bucket'lara yönlendirir
  const handleViewBuckets = (projectId: string) => {
    navigate(`/project/bucket/${projectId}`);  // Bucket sayfasına yönlendirilir
  };

  // Toggle Modal Visibility
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-200 p-8">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">Proje Yönetimi</h1>

      {/* Oluşturma butonu */}
      <div className="flex justify-center mb-8 relative">
        <button
          onClick={toggleCreateModal}  // Toggle modal on click
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Yeni Proje Oluştur
        </button>

        {/* Yeni project oluşturma popup */}
        {isCreateModalOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white p-6 rounded-lg shadow-lg w-96">
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
                onClick={handleCreateProject}  // Close modal on project creation
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

      {/* Project Listesi */}
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
                    <td className="p-4 text-sm text-gray-700 cursor-pointer" onClick={() => handleViewBuckets(project.projectId)}>
                      {project.projectName}
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date().toLocaleDateString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleOpenUpdateModal(project.projectId)}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Düzenle
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteProject(project.projectId)}
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

      {/* Project adını güncelleme popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
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
    </div>
  );
};

export default ProjectPage;
