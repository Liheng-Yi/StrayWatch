import { ShelterDAO } from './dao.js';
import { validateShelter } from './schema.js';

export class ShelterModel {
  constructor() {
    this.shelterDAO = new ShelterDAO();
  }

  async createShelter(shelterData) {
    const validatedData = validateShelter(shelterData);
    return await this.shelterDAO.createShelter(validatedData);
  }

  async getAllShelters() {
    return await this.shelterDAO.getAllShelters();
  }

  async toggleVerification(id) {
    return await this.shelterDAO.toggleVerification(id);
  }

  async deleteShelter(id) {
    return await this.shelterDAO.deleteShelter(id);
  }
} 