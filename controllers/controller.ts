import { IncomingMessage, ServerResponse } from "http";

import {
  createUser,
  deleteUserById,
  getUserById,
  getAllUsers,
  updateUserById,
} from "../service/user.service";
import { User } from "../interfaces/user";
import { isValidUuid, parseRequestBody } from "../helpers/helpers";

export const contType = { "Content-Type": "application/json" };



export const getAllUsersHandler = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const users = await getAllUsers();
    res.writeHead(200, contType);
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500, contType);
    res.end(JSON.stringify({ error: "Server Error" }));
  }
};

export const getUserByIdHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  try {
    if (isValidUuid(userId)) {
      const user = await getUserById(userId);
      if (!user) {
        res.writeHead(404, contType);
        res.write(JSON.stringify({ message: "User not found" }));
        res.end();
      } else {
        res.writeHead(200, contType);
        res.write(JSON.stringify(user));
        res.end();
      }
    } else {
      res.writeHead(400, contType);
      res.write(JSON.stringify({ message: "Invalid UUID" }));
      res.end();
    }
  } catch (error) {
    res.writeHead(500, contType);
    res.end(JSON.stringify({ error: "Server error" }));
  }
};

export const postUserHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    const body = await parseRequestBody(req);
    if (body.username && body.age && body.hobbies) {
      const newUser: User = await createUser(body);
      res.writeHead(201, contType);
      res.end(JSON.stringify(newUser));
    } else {
      res.writeHead(400, contType);
      res.end(JSON.stringify({ error: "Missing required fields" }));
    }
  } catch (error) {
    res.writeHead(500, contType);
    res.end(JSON.stringify({ error: "Server Error" }));
  }
};

export const updateUserHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
): Promise<void> => {
  try {
    if (!isValidUuid(userId)) {
      res.writeHead(400, contType);
      res.end(JSON.stringify({ message: "Invalid UUID" }));
    } else {
      const user = await getUserById(userId);
      if (!user) {
        res.writeHead(404, contType);
        res.end(JSON.stringify({ message: "User not found" }));
      } else {
        const body = await parseRequestBody(req);
        const updatedUser: User = {
          id: userId,
          username: body.username || user.username,
          age: body.age || user.age,
          hobbies: body.hobbies || user.hobbies,
        };
        const newUser = await updateUserById(userId, updatedUser);
        res.writeHead(200, contType);
        res.end(JSON.stringify(newUser));
      }
    }
  } catch (error) {
    res.writeHead(500, contType);
    res.end(JSON.stringify({ error: "Server Error" }));
  }
};

export const deleteUserHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  try {
    if (isValidUuid(userId)) {
      const user = await getUserById(userId);
      if (!user) {
        res.writeHead(404, contType);
        res.write(JSON.stringify({ message: "User not found" }));
        res.end();
      } else {
        await deleteUserById(userId);
        res.writeHead(204, contType);
        res.end();
      }
    } else {
      res.writeHead(400, contType);
      res.write(JSON.stringify({ message: "Invalid UUID" }));
      res.end();
    }
  } catch (error) {
    res.writeHead(500, contType);
    res.write(JSON.stringify({ message: "Server error" }));
    res.end();
  }
};
