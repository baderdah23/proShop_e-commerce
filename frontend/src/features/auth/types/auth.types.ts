export interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone: number;
  role: "customer" | "admin";
  is_active: boolean;
  created_at: Date;
}

export interface MeResponse {
  success: boolean;
  user: User;
}
