import { create } from 'zustand';
import axios from 'axios';

// Zustand store tipi
interface ProjectState {
  projects: { projectId: string; projectName: string }[];
  projectCreated: boolean;
  error: string | null;
  loading: boolean;
  createProject: (projectName: string, token: string) => Promise<void>;
  listProjects: (token: string) => Promise<void>;
  updateProjectName: (projectId: string, newProjectName: string, token: string) => Promise<void>;
  deleteProject: (projectId: string, token: string) => Promise<void>;
}

// Zustand store oluşturuyoruz
export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  projectCreated: false,
  error: null,
  loading: false,

  // Project oluşturma işlemi
  createProject: async (projectName, token) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        'http://localhost:8080/api/project/create', 
        { projectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Token ekleniyor
          },
        }
      );
      if (response.status === 200) {
        set((state) => ({
          projects: [...state.projects, response.data.project], // Yeni projeyi mevcut listeye ekliyoruz
          projectCreated: true,
          error: null,
        }));
      }
    } catch (error) {
      console.error('Proje oluşturulamadı:', error);
      set({ projectCreated: false, error: 'Proje oluşturulurken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },

  // Project listeleme işlemi
  listProjects: async (token) => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:8080/api/project/list', {
        headers: {
          Authorization: `Bearer ${token}`,  // Token ekleniyor
        },
      });
      set({ projects: response.data.projects, error: null });
    } catch (error) {
      console.error('Projeler listelenemedi:', error);
      set({ error: 'Projeler listelenirken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },

  // Project adı güncelleme işlemi
  updateProjectName: async (projectId, newProjectName, token) => {
    set({ loading: true });
    try {
      await axios.patch(
        `http://localhost:8080/api/project/${projectId}`,
        { newProjectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Token ekleniyor
          },
        }
      );
      set((state) => ({
        projects: state.projects.map((project) =>
          project.projectId === projectId ? { ...project, projectName: newProjectName } : project
        ),
        error: null,
      }));
    } catch (error) {
      console.error('Proje adı güncellenemedi:', error);
      set({ error: 'Proje adı güncellenirken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },

  // Project silme işlemi
  deleteProject: async (projectId, token) => {
    set({ loading: true });
    try {
      await axios.delete(`http://localhost:8080/api/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Token ekleniyor
        },
      });

      // Projeyi başarıyla sildikten sonra state'deki projeler listesini güncelliyoruz
      set((state) => ({
        projects: state.projects.filter((project) => project.projectId.toString() !== projectId), // `projectId` bir ObjectId olduğundan string karşılaştırması yapıyoruz
        error: null,
      }));

    } catch (error) {
      console.error('Proje silinemedi:', error);
      set({ error: 'Proje silinirken hata oluştu.' });
    } finally {
      set({ loading: false });
    }
  },

}));
