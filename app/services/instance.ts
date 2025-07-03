import axios from "axios";


export const base_url = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: base_url,
  
});

instance.interceptors.request.use(
  async (config) => {
    const token = typeof window !=='undefined' && JSON.parse(localStorage.getItem('token')as string) 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error.data)
);


export default instance;
