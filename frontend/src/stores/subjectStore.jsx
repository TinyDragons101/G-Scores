import { create } from "zustand";
import { getAllSubjects, getStatisticsBySubjectId, getSubjectById } from "../api/subjectApi";

const useSubjectStore = create((set) => {

  const fetchAllSubjects = async () => {
    set({ loading: true, error: null });
    try {
      const subjects = await getAllSubjects();
      console.log(subjects);
      set({ subjects, loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  };

  const fetchAllSubjectsStatistics = async () => {
    set({ loading: true, error: null, subjectsStatistics: [] });
    try {
      const state = useSubjectStore.getState();
      const statisticsList = await Promise.all(
        state.subjects.map(async (subject) => {
          const statistics = await getStatisticsBySubjectId(subject.id);
          return statistics;
        })
      );
      console.log(statisticsList);
      set({ subjectsStatistics: statisticsList, loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  };

  // Gọi fetchAllSubjects khi store khởi tạo
  (async () => {
    try {
      await fetchAllSubjects();
      await fetchAllSubjectsStatistics();
    } catch (error) {
      set({ error: error.message });
    }
  })();

  return {
    subjects: [],
    subjectsStatistics: [],
    loading: false,
    error: null,
    fetchAllSubjects,
    fetchAllSubjectsStatistics,
  };
});

export default useSubjectStore;
