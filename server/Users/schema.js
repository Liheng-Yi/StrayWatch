export const userSchema = {
  username: String,
  password: String,
  email: String,
  phone: String,
  role: String,
  createdAt: Date
};

export const validateUser = (userData) => {
  const { username, password, email, phone, role = "user" } = userData;
  
  if (!username || !password || !email) {
    throw new Error('Username, password, and email are required');
  }

  return {
    username,
    password, // Note: Password hashing will be handled in the model
    email,
    phone,
    role,
    createdAt: new Date()
  };
};

export const validateUpdateFields = (updateData) => {
  const { username, email, phone } = updateData;
  const updateFields = {};
  
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (phone) updateFields.phone = phone;
  
  return updateFields;
}; 