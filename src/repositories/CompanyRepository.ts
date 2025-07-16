import { AppDataSource } from "../dataSource";
import { Company } from "../models/Company";

/**
 * Repository handling CRUD operations for Company entities.
 * Uses TypeORM's DataSource to interact with the database.
 */
export class CompanyRepository {
  // TypeORM repository for Company model
  private CompanyRepository = AppDataSource.getRepository(Company);

  /**
   * Creates and saves a new Company record in the database.
   * @param name - Display name of the company
   * @param CNPJ - Unique registration number
   * @param email - Unique contact email
   * @param password - Plain-text password (hashed via entity hook)
   * @param phone - Contact phone number
   * @param BusinessAddress - Company's address
   * @returns The saved Company entity
   */
  async createCompany(
    name: string,
    CNPJ: string,
    email: string,
    password: string,
    phone: string,
    BusinessAddress: string
  ) {
    const company = new Company(name, CNPJ, email, password, phone, BusinessAddress);
    return await this.CompanyRepository.save(company);
  }

  /**
   * Retrieves all companies from the database.
   * @returns Array of Company entities
   */
  async findAllCompanys() {
    return await this.CompanyRepository.find();
  }

  /**
   * Finds a single Company by its ID.
   * @param id - Primary key of the company
   * @returns The Company entity or undefined if not found
   */
  async findCompanyById(id: number) {
    return await this.CompanyRepository.findOne({ where: { id } });
  }

  /**
   * Finds a single Company by its unique email.
   * @param email - Email address to search
   * @returns The Company entity or undefined if not found
   */
  async findCompanyByEmail(email: string) {
    return await this.CompanyRepository.findOne({ where: { email } });
  }

  /**
   * Updates fields of an existing Company.
   * @param id - ID of the company to update
   * @param fieldsToUpdate - Partial object containing the fields to modify
   * @returns The updated Company entity or null if not found
   */
  async updateCompany(id: number, fieldsToUpdate: Partial<Company>) {
    const company = await this.findCompanyById(id);
    if (!company) return null;

    Object.assign(company, fieldsToUpdate);
    return await this.CompanyRepository.save(company);
  }

  /**
   * Deletes a Company record from the database.
   * @param id - ID of the company to delete
   * @returns The removed Company entity or null if not found
   */
  async deleteCompany(id: number) {
    const company = await this.findCompanyById(id);
    if (!company) return null;

    return await this.CompanyRepository.remove(company);
  }
}
