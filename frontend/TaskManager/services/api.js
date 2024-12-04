
import axios from 'axios';

const API_URL = 'http://192.168.56.1:3000';

export const getTasks = async () => {
  return axios.get(`${API_URL}/tasks`);
};

export const createTask = async (task) => {
  return axios.post(`${API_URL}/tasks`, task);
};

export const provTask = async (id) => {
  return axios.get(`${API_URL}/tasks/${id}`);
};

export const updateTask = async (id, updatedTask) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}`, updatedTask);
    return response; 
  } catch (error) {
    console.error("Error updating task:", error);
    throw error; 
  }
};

export const deleteTask = async (id) => {
  return axios.delete(`${API_URL}/tasks/${id}`);
};
export const updateTaskStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};
