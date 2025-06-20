import { Request, Response } from "express";
import { CompanyRepository } from "../repositories/CompanyRepository";
import bcrypt from "bcryptjs";
import { generateToken } from "../auth";

const repo = new CompanyRepository();

export class CompanyController {


  static async register(req: Request, res: Response) {
    try {
      const { name, CNPJ, email, password, phone, BusinessAddress} = req.body;

      const existing = await repo.findCompanyByEmail(email);
      if (existing) {
        res.status(409).json({ message: "Email já em uso." });
        return;
      }

      const company = await repo.createCompany(name, CNPJ, email, password, phone, BusinessAddress);
      res.status(201).json(company);
      return;
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar empresa", details: error });
      return;
    }
  }

  
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log("Tentando login para:", email);
  
      const company = await repo.findCompanyByEmail(email);
      if (!company) {
        console.log("Empresa não encontrado");
        res.status(404).json({ message: "Empresa não encontrado." });
        return;
      }
  
      const isValid = await bcrypt.compare(password, company.password);
      if (!isValid) {
        console.log("Senha inválida");
        res.status(401).json({ message: "Senha inválida." });
        return;
      }
  
      const token = generateToken({ id: company.id, email: company.email });
      console.log("Login bem-sucedido:", token);
  
      res.json({ message: "Login autorizado", token });
    } catch (error: any) {
      console.error("Erro no login:", error);
      res.status(500).json({
        message: "Erro ao fazer login",
        details: {
          message: error?.message || "Erro desconhecido",
          stack: error?.stack || null,
          raw: error,
        },
      });
  }}
  

  
  static async getAll(req: Request, res: Response) {
    try {
      const companys = await repo.findAllCompanys();
      res.json(companys);
      return;
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar empresas", details: error });
      return;
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const company = await repo.findCompanyById(id);
      if (!company) {
        res.status(404).json({ message: "Empresa não encontrada." });
        return;
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar empresa", details: error });
      return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name,CNPJ, email, password, phone, BusinessAddress } = req.body;

      const fieldsToUpdate = { name,CNPJ, email, password, phone, BusinessAddress};
      const updated = await repo.updateCompany(id, fieldsToUpdate);

      if (!updated) {
        res.status(404).json({ message: "Empresa não encontrada." });
        return;
      }

      res.json({ message: "Empresa atualizada com sucesso.", updated });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar empresa", details: error });
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await repo.deleteCompany(id);

      if (!deleted) {
        res.status(404).json({ message: "Empresa não encontrada." });
        return;
      }

      res.json({ message: "Empresa deletada com sucesso." });
      return;
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar empresa", details: error });
      return;
    }
  }

}
