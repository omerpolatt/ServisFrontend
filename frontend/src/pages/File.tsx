import React, { useEffect, useState } from 'react';
import { useFileStore } from '../stores/FileStore';
import { useParams } from 'react-router-dom';
import { TbTrashXFilled } from 'react-icons/tb';

const FileList: React.FC = () => {
  const { subfolderId } = useParams<{ subfolderId: string }>();
  const { files, loading, error, listFiles, deleteFile } = useFileStore();
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [confirmationInput, setConfirmationInput] = useState("");

  useEffect(() => {
    if (subfolderId && token) {
      listFiles(subfolderId, token);
    }
  }, [subfolderId, token, listFiles]);

  const openDeleteDialog = (fileId: string, fileName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(fileName);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (token && selectedFileId) {
      deleteFile(selectedFileId, token);
      setDialogOpen(false);
      setConfirmationInput("");
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setConfirmationInput("");
  };

  // Dosya adlarına göre alfabetik olarak sıralama
  const sortedFiles = (files || []).slice().sort((a, b) => a.fileName.localeCompare(b.fileName));

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex justify-center">
      <div className="w-full max-full bg-white shadow-lg rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Dosya Yönetimi</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300">
                <th className="p-4 font-semibold text-gray-600 text-center border">Sıra No</th>
                <th className="p-4 font-semibold text-gray-600 text-center border">Dosya Adı</th>
                <th className="p-4 font-semibold text-gray-600 text-center border">Dosya Türü</th>
                <th className="p-4 font-semibold text-gray-600 text-center border">Oluşturulma Tarihi</th>
                <th className="p-4 font-semibold text-gray-600 text-left border">Sil</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : sortedFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    Dosya yoktur.
                  </td>
                </tr>
              ) : (
                sortedFiles.map((file, index) => (
                  <tr key={file._id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="p-4 text-gray-800 text-center border">{index + 1}</td>
                    <td className="p-4 text-gray-800 text-center border">
                      {file.fileName.replace(/\.[^/.]+$/, "")}
                    </td>
                    <td className="p-4 text-gray-800 text-center border">{file.fileType}</td>
                    <td className="p-4 text-gray-800 text-center border">{new Date(file.uploadedAt).toLocaleString()}</td>
                    <td className="p-4 text-center border">
                      <button
                        onClick={() => openDeleteDialog(file._id, file.fileName)}
                        className="flex items-center justify-center text-red-500 hover:text-red-700 font-semibold transition duration-150 ease-in-out"
                      >
                        <TbTrashXFilled className="mr-1 " size={16} /> Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg p-8 w-96">
            <h3 className="text-xl font-semibold mb-4 text-center">Dosyayı Sil</h3>
            <p className="text-center mb-4">"{selectedFileName?.replace(/\.[^/.]+$/, "")}" dosyasını silmek için dosya adını yazın:</p>
            <input
              type="text"
              className="w-full border p-2 rounded mb-4"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="Dosya Adını Girin"
            />
            <div className="flex justify-end gap-4">
              <button onClick={closeDialog} className="px-4 py-2 text-gray-600 hover:text-gray-800">İptal</button>
              <button
                onClick={handleDelete}
                disabled={confirmationInput !== selectedFileName?.replace(/\.[^/.]+$/, "")}
                className={`px-4 py-2 rounded text-white ${confirmationInput === selectedFileName?.replace(/\.[^/.]+$/, "") ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;