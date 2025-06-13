import { create } from 'zustand';
import { getAllStudents, getStudentById, getScoresByStudentId, getTopStudentsByGroup } from '../api/studentApi';
import axiosInstance from '../config/apiConfig';

const useStudentStore = create((set) => ({
  student: null,
  loading: false,
  error: null,
  topStudents: [],

  fetchStudentScores: async (studentId) => {
    set({ loading: true, error: null });
    try {
      const student = await getScoresByStudentId(studentId);
      set({ student, loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  fetchTopStudentsByGroup: async (group, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const topStudents = await getTopStudentsByGroup(group, limit);
      set({ topStudents, loading: false });
      console.log("Student Store fetchTopStudentsByGroup", useStudentStore.getState().topStudents);
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  }

}));

export default useStudentStore;