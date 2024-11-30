export const signup = async (userData: {
  username: string;
  password: string;
  email: string;
  phone: string;
  role?: "user" | "shelter" | "admin";
}) => {
  try {
    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const userWithoutPassword = await response.json();
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

export const signin = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await fetch("/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signin failed");
    }

    const userWithoutPassword = await response.json();
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
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
export const updateProfile = async (userId: string, updates: any) => {};

export const getAllUsers = async () => {};

export const getUserById = async (userId: string) => {};

//just for pushing to github branch
