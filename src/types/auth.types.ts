export interface LoginDto {
  userName: string;
  password?: string;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password?: string;
  riskLevel?: number; // 0: Low, 1: Medium, 2: High
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
}
