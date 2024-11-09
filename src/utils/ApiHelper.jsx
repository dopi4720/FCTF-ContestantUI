import axios from "axios";
import { ACCESS_TOKEN_KEY } from "../constants/LocalStorageKey";

class ApiHelper {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL,
      headers: this._getAuthHeaders(),
    });

    this.api.interceptors.request.use((config) => {
      const authHeaders = this._getAuthHeaders();
      config.headers = { ...config.headers, ...authHeaders };
      return config;
    });

    // Thêm interceptors.response để xử lý lỗi 401
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
        }
        return Promise.reject(error);
      }
    );
  }

  _getAuthHeaders() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("GET request error:", error);
      throw error;
    }
  }

  async post(url, data = {}) {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      console.error("POST request error:", error);
      throw error;
    }
  }
}

export default ApiHelper;