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
  
  if (!username || !password || !email) {
    throw new Error('Username, password, and email are required');
  }

  const validatedUser = {
    username,
    password,
    email,
    phone,
    role,
    createdAt: new Date()
  };

  // Only add shelters array if role is shelter
  if (role === "shelter") {
    validatedUser.shelters = [];
  }

  return validatedUser;
};

export const validateUpdateFields = (updateData) => {
  const { username, email, phone } = updateData;
  const updateFields = {};
  
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (phone) updateFields.phone = phone;
  
  return updateFields;
}; 