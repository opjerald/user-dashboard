import type { Response, User, UserForm } from "../types/users";

const API_URL = "http://localhost:3000/api/users";

export const getUsers = async (searchParams: string) => {
  const response = await fetch(`${API_URL}?${searchParams}`);

  const data = (await response.json()) as Response<User>;

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getUserById = async (userId: number) => {
  const response = await fetch(`${API_URL}/${userId}`);

  const data = (await response.json()) as Response<User>;

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const createUser = async (formData: UserForm) => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData, null, 2),
  });

  const data = (await response.json()) as Response<User>;

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const updateUser = async (
  userId: number,
  formData: UserForm,
) => {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData, null, 2),
  });

  const data = (await response.json()) as Response<User>;

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const deleteUser = async (userId: number) => {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "DELETE",
  });

  const data = (await response.json()) as Response<User>;

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
