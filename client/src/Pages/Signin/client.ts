import * as db from "../../Database";

export const signup = async (userData: {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}) => {
  // Check if username already exists
  const existingUser = db.findUserByUsername(userData.username);
  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Create new user
  const newUser = db.createUser(userData);
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const signin = async (credentials: {
  username: string;
  password: string;
}) => {
  // Find user by credentials
  const user = db.findUserByCredentials(
    credentials.username,
    credentials.password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Don't send password back
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const signout = async () => {
  // In a local database, we just return success
  return { success: true };
};

export const profile = async () => {
  // In a real app, this would use a token or session
  // For now, we'll just throw an error
  throw new Error("Not implemented");
};

export const checkAuth = async () => {
  // In a real app, this would verify a token or session
  // For now, we'll just return null
  return null;
};

// Additional functions for user management
export const updateProfile = async (userId: string, updates: any) => {
  return db.updateUser(userId, updates);
};

export const getAllUsers = async () => {
  return db.findAllUsers();
};

export const getUserById = async (userId: string) => {
  return db.findUserById(userId);
};
