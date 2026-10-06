export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
}

export type UserForm = Omit<User, "id">;

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Response<T> = {
  success: boolean;
  message: string;
  data: T[],
  pagination?: Pagination
}

