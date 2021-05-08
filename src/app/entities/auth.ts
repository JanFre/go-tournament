export interface Role {
  id: number;
  name: string;
  description: string;
  type: string;
  created_by?: any;
  updated_by?: any;
}

export interface CreatedBy {
  id: number;
  firstname: string;
  lastname: string;
  username?: any;
}

export interface UpdatedBy {
  id: number;
  firstname: string;
  lastname: string;
  username?: any;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: Role;
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  created_at: Date;
  updated_at: Date;
  tokens?: any;
}

export interface Token {
  jwt: string;
  user: User;
}
