import { client } from '../db/connector.js';
import { ObjectId } from 'mongodb';

export class PetDAO {
  constructor() {
    this.db = client.db("appDB");
    this.collection = this.db.collection("pets");
  }

  async searchPets(query, criteria) {
    let searchQuery = {};
    if (query && query.trim()) {
      if (criteria && criteria !== 'all') {
        searchQuery = { [criteria]: { $regex: new RegExp(query, 'i') } };
      } else {
        searchQuery = { 
          $text: { 
            $search: query,
            $caseSensitive: false,
            $diacriticSensitive: false
          }
        };
      }
    }

    return await this.collection
      .find(searchQuery)
      .sort(criteria === 'all' ? { score: { $meta: "textScore" } } : {})
      .toArray();
  }

  async getAllPets(type) {
    let query = {};
    if (type && type !== "all") {
      query = { kind: { $regex: new RegExp(type, "i") } };
    }
    return await this.collection.find(query).toArray();
  }

  async getPetById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid pet ID format");
    }
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async deletePet(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid pet ID format");
    }
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new Error("Pet not found");
    }
    return result;
  }

  async createPet(petData) {
    const result = await this.collection.insertOne(petData);
    return result;
  }

  async getUserPets(userId) {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }
    return await this.collection.find({ userId: new ObjectId(userId) }).toArray();
  }

  async updatePet(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid pet ID format");
    }
    
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error("Pet not found");
    }

    return result;
  }
} 