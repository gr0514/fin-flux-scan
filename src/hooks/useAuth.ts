import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { LoginDto, RegisterDto } from '@/types/auth.types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    },
  });
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: () => {
      toast.success('Đăng ký tài khoản thành công!');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
    },
  });
};
