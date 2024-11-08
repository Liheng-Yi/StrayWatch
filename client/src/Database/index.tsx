import users from "./users.json";

// Add user types
export interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  createdAt: string;
}

// Mock database functions
let localUsers = [...users];

export const findAllUsers = () => {
  return localUsers;
};

export const findUserById = (userId: string) => {
  return localUsers.find((user) => user._id === userId);
};

export const findUserByUsername = (username: string) => {
  return localUsers.find((user) => user.username === username);
};

export const findUserByCredentials = (username: string, password: string) => {
  return localUsers.find(
    (user) => user.username === username && user.password === password
  );
};

export const createUser = (user: Omit<User, "_id" | "createdAt">) => {
  const newUser = {
    ...user,
    _id: (localUsers.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };
  localUsers.push(newUser);
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>) => {
  localUsers = localUsers.map((user) =>
    user._id === userId ? { ...user, ...updates } : user
  );
  return findUserById(userId);
};

export const deleteUser = (userId: string) => {
  localUsers = localUsers.filter((user) => user._id !== userId);
};

export { users };
