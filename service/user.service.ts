
import { v4 as uuidv4 } from "uuid";
import { User } from "../interfaces/user";
import { usersDB } from "../database/db";


export const getAllUsers = (): User[] => usersDB;

export const getUserById = (userId: string): User | undefined =>
  usersDB.find((user) => user.id === userId);

export const createUser = (userData: User): User => {
  const newUser: User = { id: uuidv4(), ...userData };
  usersDB.push(newUser);
  return newUser;
};

export const updateUserById = async (
  userId: string,
  updatedData: User
): Promise<User | null> => {
  const userIndex = usersDB.findIndex((user) => user.id === userId);
  if (userIndex === -1) return null;

  usersDB[userIndex] = { ...usersDB[userIndex], ...updatedData };
  return usersDB[userIndex];
};

export const deleteUserById = (userId: string): boolean => {
  const userIndex = usersDB.findIndex((user) => user.id === userId);
  if (userIndex === -1) return false;

  usersDB.splice(userIndex, 1);
  return true;
};
