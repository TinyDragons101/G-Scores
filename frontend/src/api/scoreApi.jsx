import axiosInstance from '../config/apiConfig';

export const getScores = async () => {
  try {
    const response = await axiosInstance.get('/scores');
    return response.data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
}

