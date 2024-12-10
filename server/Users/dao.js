import { client } from '../db/connector.js';
import { ObjectId } from 'mongodb';

export class UserDAO {
  constructor() {
    this.db = client.db("appDB");
    this.collection = this.db.collection("users");
  }

  async findByUsername(username) {
    return await this.collection.findOne({ username });
  }

  async findByUsernameOrEmail(username, email) {
    return await this.collection.findOne({
      $or: [{ username }, { email }]
    });
  }

  async createUser(userData) {
    const result = await this.collection.insertOne(userData);
    return { ...userData, _id: result.insertedId };
  }

  async updateUser(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid user ID format');
    }

    // If it's a $push operation, use it directly as the update operator
    if (updateData.$push) {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $push: updateData.$push }
      );
      
      if (!result.acknowledged) {
        throw new Error('Failed to update user');
      }
      
      return result;
    }

    // For regular updates, use $set operator
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (!result.acknowledged) {
      throw new Error('Failed to update user');
    }

    return result;
  }

  async findById(userId) {
    return await this.collection.findOne({ _id: new ObjectId(userId) });
  }

  sanitizeUser(user) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
} 