import React, { useEffect, useState } from 'react';
import { useFileStore } from '../stores/FileStore';
import { useParams } from 'react-router-dom';
import { TbTrashXFilled } from 'react-icons/tb';

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const FileList: React.FC = () => {
  const { bucketId } = useParams<{ bucketId: string }>();
  const { files, loading, error, getAccessKey, listFiles, deleteFile } = useFileStore();
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  const [accessKey, setAccessKey] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isMultiDeleteDialogOpen, setMultiDeleteDialogOpen] = useState(false);
  const [isMultiDeleteMode, setMultiDeleteMode] = useState(false);

  useEffect(() => {
    const fetchAccessKeyAndFiles = async () => {
      if (bucketId && token) {
        const key = await getAccessKey(bucketId, token);
        if (key) {
          setAccessKey(key);
          listFiles(key, token);
        }
      }
    };
    fetchAccessKeyAndFiles();
  }, [bucketId, getAccessKey, listFiles, token]);

  const openDeleteDialog = (fileId: string, fileName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(fileName);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (token && selectedFileId && accessKey) {
      deleteFile(selectedFileId, accessKey, token);
      setDialogOpen(false);
      setConfirmationInput("");
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setConfirmationInput("");
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles((prev) => {
      const newSelectedFiles = new Set(prev);
      if (newSelectedFiles.has(fileId)) newSelectedFiles.delete(fileId);
      else newSelectedFiles.add(fileId);
      return newSelectedFiles;
    });
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === files.length) setSelectedFiles(new Set());
    else setSelectedFiles(new Set(files.map((file) => file._id)));
  };

  const handleMultiDelete = () => {
    if (accessKey && token) {
      Array.from(selectedFiles).forEach((fileId) => deleteFile(fileId, accessKey, token));
      setMultiDeleteDialogOpen(false);
      setSelectedFiles(new Set());
      setMultiDeleteMode(false);
    }
  };

  const toggleMultiDeleteMode = () => {
    setMultiDeleteMode((prev) => {
      if (prev) setSelectedFiles(new Set());
      return !prev;
    });
  };

  const sortedFiles = (files || []).slice().sort((a, b) => a.fileName.localeCompare(b.fileName));

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex justify-center">
      <div className="w-full max-full bg-white shadow-lg rounded-lg">
        <div className="p-6 border-b border-gray-200 flex justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Dosya Yönetimi</h2>
          <button
            onClick={toggleMultiDeleteMode}
            className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
          >
            Toplu Sil
          </button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300">
                {isMultiDeleteMode && (
                  <th className="p-4">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedFiles.size === files.length} />
                  </th>
                )}
                <th className="p-4 font-semibold text-gray-600 text-center border">Sıra No</th>
                <th className="p-4 font-semibold text-gray-600 text-center border">Dosya Adı</th>
                <th className="p-4 font-semibold text-gray-600 text-center border">Dosya Türü</th>
                <th className="p-4 font-semibold text-gray-600 text-center border">Dosya Boyutu</th>
                <th className="p-4 font-semibold text-gray-600 text-center border">Oluşturulma Tarihi</th>
                <th className="p-4 font-semibold text-gray-600 text-left border">Sil</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : sortedFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-500">
                    Dosya yoktur.
                  </td>
                </tr>
              ) : (
                sortedFiles.map((file, index) => (
                  <tr key={file._id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                    {isMultiDeleteMode && (
                      <td className="p-4 text-center border">
                        <input type="checkbox" checked={selectedFiles.has(file._id)} onChange={() => handleSelectFile(file._id)} />
                      </td>
                    )}
                    <td className="p-4 text-gray-800 text-center border">{index + 1}</td>
                    <td className="p-4 text-gray-800 text-center border">
                      {file.fileName.replace(/\.[^/.]+$/, "")}
                    </td>
                    <td className="p-4 text-gray-800 text-center border">{file.fileType}</td>
                    <td className="p-4 text-gray-800 text-center border">{formatFileSize(file.fileSize)}</td>
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
      {/* Single Delete Confirmation Dialog */}
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
      {/* Multi Delete Confirmation Dialog */}
      {isMultiDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg p-8 w-96">
            <h3 className="text-xl font-semibold mb-4 text-center">Seçilen Dosyaları Sil</h3>
            <p className="text-center mb-4">Seçilen dosyaları silmek istediğinize emin misiniz?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setMultiDeleteDialogOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">İptal</button>
              <button
                onClick={handleMultiDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
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
