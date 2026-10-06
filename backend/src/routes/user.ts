import express, { Request, Response } from "express";
import path from "path";

import { readFile, writeFile } from "fs/promises";

const userRouter = express.Router();

const filePath = path.join(process.cwd(), "src", "data", "user.json");

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type UserData = Omit<User, "id">;

const getUsers = async (): Promise<User[]> => {
  const file = await readFile(filePath, "utf-8");
  return JSON.parse(file) as User[];
};

const saveUsers = async (users: User[]) => {
  await writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
};

const getUserId = (req: Request) => {
  return Number(req.params.id);
};

const findUser = (userId: number, users: User[]) => {
  return users.find((user) => user.id === userId);
};

const getUserIndex = (userId: number, users: User[]) => {
  return users.findIndex((user) => user.id === userId);
};

const handleError = (res: Response, error: unknown, message: string) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message,
  });
};

const getNextUserId = (users: User[]) => {
  return users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;
};

const filterUsers = (users: User[], query: string) => {
  if (!query) {
    return users;
  }

  const search = query.trim().toLowerCase();

  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(search) ||
      user.username.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search),
  );
};

userRouter.get("/users", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const query = String(req.query.q || "");

  try {
    const users = await getUsers();
    const filteredUsers = filterUsers(users, query);

    const totalPages = Math.ceil(filteredUsers.length / limit);

    if (page < 1 || (page > totalPages && totalPages > 0)) {
      res.status(400).json({
        success: false,
        message: "Invalid page number",
      });
      return;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      message: "Users fetched successfully",
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch users")
  }
});

userRouter.get("/users/:id", async (req, res) => {
  const id = getUserId(req);

  try {
    const users = await getUsers();
    const user = findUser(id, users);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.json({
      success: true,
      message: "User fetched successfully",
      data: [user],
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch user");
  }
});

userRouter.post("/users", async (req, res) => {
  const userData = req.body as UserData;

  try {
    const users = await getUsers();

    const newUser: User = {
      id: getNextUserId(users),
      ...userData
    }

    users.push(newUser);

    await saveUsers(users);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: users,
    });
  } catch (error) {
    handleError(res, error, "Failed to create user"); 
  }
});

userRouter.put("/users/:id", async (req, res) => {
  const id = getUserId(req);
  const userData = req.body as UserData;

  try {
    const users = await getUsers();

    const userIndex = getUserIndex(id, users)

    if (userIndex === -1) {
      res.status(404).json({
        success: false,
        message: "User not found.",
        data: [],
      });
      return;
    }

    users[userIndex] = {
      id,
      ...userData
    }

    await saveUsers(users);

    res.json({
      success: true,
      message: "User updated successfully",
      data: users,
    });
  } catch (error) {
    handleError(res, error, "Failed to update user");
  }
});

userRouter.delete("/users/:id", async (req, res) => {
  const id = getUserId(req);

  try {
    const users = await getUsers();

    const userIndex = getUserIndex(id, users);

    if (userIndex === -1) {
      res.status(404).json({
        success: false,
        message: "User not found.",
        data: [],
      });
      return;
    }

    const updatedUsers = users.filter((u) => u.id !== Number(id));

    await saveUsers(updatedUsers);

    res.json({
      success: true,
      message: "User deleted successfully",
      data: updatedUsers,
    });
  } catch (error) {
    handleError(res, error, "Failed to delete user");
  }
});

export default userRouter;
