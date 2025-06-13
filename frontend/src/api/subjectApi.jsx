import axiosInstance from "../config/apiConfig";

export const getAllSubjects = async () => {
  try {
    const response = await axiosInstance.get('/subjects');
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
}

export const getSubjectById = async (subjectId) => {
  try {
    const response = await axiosInstance.get(`/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subject by ID:', error);
    throw error;
  }
}

export const getStatisticsBySubjectId = async (subjectId) => {
  try {
    const response = await axiosInstance.get(`/subjects/${subjectId}/statistics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}