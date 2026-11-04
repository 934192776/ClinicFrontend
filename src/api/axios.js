import axios from 'axios';

// 创建 axios 实例，设置后端的公共地址
const api = axios.create({
    // 这个是为了部署到 Render 做准备）
baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/',
});

// 请求拦截器：每次发送请求前，自动把 Token 塞进 Header 里
api.interceptors.request.use(
    (config) => {
        // 从浏览器的 localStorage 中获取 token
        const token = localStorage.getItem('token');
        if (token) {
            // 按照 DRF 的格式，带上 Token（注意 Token 后面有空格）
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;