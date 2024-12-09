import { PetDAO } from './dao.js';
import { validatePet, validateUpdateData } from './schema.js';

export class PetModel {
  constructor() {
    this.petDAO = new PetDAO();
  }

  async searchPets(query, criteria) {
    return await this.petDAO.searchPets(query, criteria);
  }

  async getAllPets(type) {
    return await this.petDAO.getAllPets(type);
  }

  async getPetById(id) {
    return await this.petDAO.getPetById(id);
  }

  async deletePet(id) {
    return await this.petDAO.deletePet(id);
  }

  async createPet(petData, file) {
    const validatedData = validatePet(petData, file);
    return await this.petDAO.createPet(validatedData);
  }

  async getUserPets(userId) {
    const pets = await this.petDAO.getUserPets(userId);
    if (!pets.length) {
      throw new Error("No pets found for this user");
    }
    return pets;
  }

  async updatePet(id, updateData, file) {
    const validatedUpdate = validateUpdateData(updateData, file);
    return await this.petDAO.updatePet(id, validatedUpdate);
  }
} 