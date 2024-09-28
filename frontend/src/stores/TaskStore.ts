import { create } from 'zustand';

interface Task {
  TaskName: string;
  TaskDescription: string;
  TaskStartDate: string;
  TaskEndDate: string;
  userId: string;
}

interface TaskStore {
  taskData: Omit<Task, 'userId'>;
  setTaskData: (data: Partial<Omit<Task, 'userId'>>) => void;
  resetTaskData: () => void;
  submitTask: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  taskData: {
    TaskName: '',
    TaskDescription: '',
    TaskStartDate: '',
    TaskEndDate: '',
  },
  setTaskData: (data) => set((state) => ({ taskData: { ...state.taskData, ...data } })),
  resetTaskData: () => set({ taskData: { TaskName: '', TaskDescription: '', TaskStartDate: '', TaskEndDate: '' } }),
  submitTask: async () => {
    const userId = localStorage.getItem('userId'); // Local storage'dan kullanıcı ID'sini al

    if (!userId) {
      console.error('Kullanıcı ID\'si bulunamadı.');
      return;
    }

    const taskWithUserId = {
      ...useTaskStore.getState().taskData,
      userId, // Kullanıcı ID'sini göreve ekliyoruz
    };

    try {
      const response = await fetch('http://localhost:5050/api/task/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskWithUserId),
      });

      if (!response.ok) {
        throw new Error('Görev eklenirken hata oluştu');
      }

      const data = await response.json();
      console.log('Görev başarıyla eklendi:', data);
      useTaskStore.getState().resetTaskData(); // Görev eklendikten sonra form sıfırlanır
    } catch (error) {
      console.error('Görev eklenirken hata oluştu:', error);
    }
  },
}));
