import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { LoginDto, RegisterDto, AuthResponse } from '@/types/auth.types';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },
};
