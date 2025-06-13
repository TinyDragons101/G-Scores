import axiosInstance from "../config/apiConfig";

export const getAllStudents = async () => {
	try {
		const response = await axiosInstance.get('/students');
		return response.data;
	} catch (error) {
		console.error('Error fetching students:', error);
		throw error;
	}
}

export const getStudentById = async (studentId) => {
	try {
		console.log(studentId);
		const response = await axiosInstance.get(`/students/${studentId}`);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching student by ID:', error);
		throw error;
	}
}

export const getScoresByStudentId = async (studentId) => {
  try {
	console.log(studentId);
    const response = await axiosInstance.get(`/students/${studentId}/scores`);
	console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
}

export const getTopStudentsByGroup = async (group, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/students/top?group=${group}&limit=${limit}`);
	console.log("Student API getTopStudentsByGroup", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching top students:', error);
    throw error;
  }
}