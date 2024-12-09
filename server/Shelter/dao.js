import { client } from '../db/connector.js';
import { ObjectId } from 'mongodb';

export class ShelterDAO {
  constructor() {
    this.db = client.db("appDB");
    this.collection = this.db.collection("shelters");
  }

  async createShelter(shelterData) {
    const result = await this.collection.insertOne(shelterData);
    if (!result.acknowledged) {
      throw new Error('Failed to register shelter');
    }
    return { ...shelterData, _id: result.insertedId };
  }

  async getAllShelters() {
    return await this.collection.find({}).toArray();
  }

  async findShelterById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid shelter ID format');
    }
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async toggleVerification(id) {
    const shelter = await this.findShelterById(id);
    if (!shelter) {
      throw new Error('Shelter not found');
    }

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { verified: !shelter.verified } }
    );

    if (!result.acknowledged) {
      throw new Error('Failed to update shelter');
    }

    return { verified: !shelter.verified };
  }

  async deleteShelter(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid shelter ID format');
    }

    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new Error('Shelter not found');
    }
    return result;
  }
} 