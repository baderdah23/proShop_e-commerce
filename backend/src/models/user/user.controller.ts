import { Request, Response, NextFunction } from "express";
import { UserSchema } from "./user.validation.js";
import {
  getUserByIdQuery,
  createUserQuery,
  getAllUsers,
  updateUserQuery,
  deleteUserQuery,
} from "./user.repo.js";
import apiError from "../../utils/apiError.js";
import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getByIdHandler,
  updateHandler,
} from "../../utils/handlersFactory.js";

const createUser = createHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = UserSchema.safeParse(req.body);
    if (!result.success) {
      const err = new apiError("Invalid request body", 400);
      next(err);
      return;
    }

    const { full_name, email, phone, password } = result.data as {
      full_name: string;
      email: string;
      phone: string;
      password: string;
    };

    return await createUserQuery(full_name, email, phone, password);
  },
  "User",
);

const getUsers = getAllHandler(async (req: Request) => {
  const { limit = 10, page = 1 } = req.query as {
    limit: string;
    page: string;
  };

  const offset = (Number(page) - 1) * Number(limit);
  return await getAllUsers(Number(limit), offset);
}, "User");

const getUserById = getByIdHandler(
  (id: string) => getUserByIdQuery(id),
  "User",
);

const updateUser = updateHandler(async (req: Request) => {
  const id = req.params.id as string;
  const { full_name, email, phone, password } = req.body;
  return updateUserQuery(id, full_name, email, phone, password);
}, "User");

const deleteUser = deleteHandler((id: string) => deleteUserQuery(id), "User");

export { createUser, getUsers, getUserById, updateUser, deleteUser };
