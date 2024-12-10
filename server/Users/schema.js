export const userSchema = {
  username: String,
  password: String,
  email: String,
  phone: String,
  role: String,
  shelters: Array,
  createdAt: Date
};

export const validateUser = (userData) => {
  const { username, password, email, phone, role = "user" } = userData;
  
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  // Only validate email and phone for non-admin roles
  if (role !== "admin" && (!email || !phone)) {
    throw new Error('Email and phone are required for non-admin users');
  }

  const validatedUser = {
    username,
    password,
    role,
    createdAt: new Date()
  };

  // Only add email and phone if not admin
  if (role !== "admin") {
    validatedUser.email = email;
    validatedUser.phone = phone;
  }

  // Only add shelters array if role is shelter
  if (role === "shelter") {
    validatedUser.shelters = [];
  }

  return validatedUser;
};

export const validateUpdateFields = (updateData) => {
  const { username, email, phone, $push } = updateData;
  const updateFields = {};
  
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (phone) updateFields.phone = phone;
  
  // Handle shelter array updates
  if ($push && $push.shelters) {
    updateFields.$push = { shelters: $push.shelters };
  }
  
  return updateFields;
}; 