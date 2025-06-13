import { create } from 'zustand';
import axiosInstance from '../config/apiConfig';

const useScoreStore = create((set) => ({
  scores: [],
  loading: false,
  error: null,

  
}));