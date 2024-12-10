import { UserDAO } from './dao.js';
import { validateUser, validateUpdateFields } from './schema.js';
import bcrypt from 'bcrypt';

export class UserModel {
  constructor() {
    this.userDAO = new UserDAO();
  }

  async signin(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const user = await this.userDAO.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // TODO: In production, use this line instead:
    // const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = password === user.password; // Temporary direct comparison

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return this.userDAO.sanitizeUser(user);
  }

  async signup(userData) {
    const validatedData = validateUser(userData);
    
    const existingUser = await this.userDAO.findByUsernameOrEmail(
      validatedData.username, 
      validatedData.email
    );

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // TODO: In production, hash the password:
    // validatedData.password = await bcrypt.hash(validatedData.password, 10);

    const newUser = await this.userDAO.createUser(validatedData);
    return this.userDAO.sanitizeUser(newUser);
  }

  async updateProfile(userId, updateData) {
    const updateFields = validateUpdateFields(updateData);
    
    const result = await this.userDAO.updateUser(userId, updateFields);
    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }

    if (result.modifiedCount === 0) {
      throw new Error('No changes were made');
    }

    return { message: 'Profile updated successfully' };
  }
} 