import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add session cookie
    this.api.interceptors.request.use(
      async (config) => {
        const sessionCookie = await SecureStore.getItemAsync('sessionCookie');
        if (sessionCookie) {
          config.headers.Cookie = sessionCookie;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle session
    this.api.interceptors.response.use(
      async (response) => {
        // Save session cookie if present
        const setCookie = response.headers['set-cookie'];
        if (setCookie && setCookie.length > 0) {
          await SecureStore.setItemAsync('sessionCookie', setCookie[0]);
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Session expired, clear stored session
          SecureStore.deleteItemAsync('sessionCookie');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(userId: string): Promise<any> {
    const response = await this.api.post('/api/auth/login', { userId });
    return response.data;
  }

  async logout(): Promise<any> {
    const response = await this.api.post('/api/auth/logout');
    await SecureStore.deleteItemAsync('sessionCookie');
    return response.data;
  }

  async checkSession(): Promise<any> {
    const response = await this.api.get('/api/auth/session');
    return response.data;
  }

  // Plant codes
  async getPlants(): Promise<any> {
    const response = await this.api.get('/api/plants');
    return response.data;
  }

  // Orders APIs
  async getShipments(params: any): Promise<any> {
    const response = await this.api.get('/api/shipment', { params });
    return response.data;
  }

  async getShipmentDetail(shipmentNo: string): Promise<any> {
    const response = await this.api.get(`/api/shipment/${shipmentNo}`);
    return response.data;
  }

  // Slips APIs  
  async getSlips(params: any): Promise<any> {
    const response = await this.api.get('/api/slip', { params });
    return response.data;
  }

  async getSlipDetail(shipmentNo: string): Promise<any> {
    const response = await this.api.get(`/api/slip/${shipmentNo}`);
    return response.data;
  }

  // Ticket API
  async getTicket(shipmentNo: string): Promise<any> {
    const response = await this.api.get(`/api/ticket/${shipmentNo}`);
    return response.data;
  }
}

export default new ApiService();