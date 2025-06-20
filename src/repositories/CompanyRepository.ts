import { AppDataSource } from "../dataSource";
import { Company } from "../models/Company";

export class CompanyRepository {
  private CompanyRepository = AppDataSource.getRepository(Company);

  async createCompany(name: string,CNPJ:number, email: string, password: string, phone: string, BusinessAddress: string) {
    const company = new Company(name, CNPJ, email, password, phone, BusinessAddress);
    return await this.CompanyRepository.save(company);
  }

  async findAllCompanys() {
    return await this.CompanyRepository.find();
  }

  async findCompanyById(id: number) {
    return await this.CompanyRepository.findOne({ where: { id } });
  }

  async findCompanyByEmail(email: string) {
    return await this.CompanyRepository.findOne({ where: { email } });
  }

  async updateCompany(id: number, fieldsToUpdate: Partial<Company>) {
    const company = await this.findCompanyById(id);
    if (!company) return null;

    Object.assign(company, fieldsToUpdate);
    return await this.CompanyRepository.save(company);
  }

  async deleteCompany(id: number) {
    const company = await this.findCompanyById(id);
    if (!company) return null;

    return await this.CompanyRepository.remove(company);
  }
}
