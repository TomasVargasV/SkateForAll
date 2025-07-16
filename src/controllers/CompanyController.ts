import { Request, Response } from "express";
import { CompanyRepository } from "../repositories/CompanyRepository";
import bcrypt from "bcryptjs";
import { generateToken } from "../auth";
import { DrawRepository } from "../repositories/DrawRepository";
import { AppDataSource } from "../dataSource";
import { Draw } from "../models/Draw";

const repo = new CompanyRepository();

export class CompanyController {

  static async register(req: Request, res: Response) {
    try {
      const { name, CNPJ, email, password, phone, BusinessAddress } = req.body;

      const existing = await repo.findCompanyByEmail(email);
      if (existing) {
        res.status(409).json({ message: "Email já em uso." });
        return;
      }

      const company = await repo.createCompany(name, CNPJ, email, password, phone, BusinessAddress);
      const token = generateToken({
        id: company.id,
        email: company.email,
        type: 'company'
      });

      res.status(201).json({ company: company, token });
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

      const token = generateToken({
        id: company.id,
        email: company.email,
        type: 'company'
      });

      console.log("Login bem-sucedido:", token);

      res.json({ message: "Login autorizado", token });
      return
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
      return
    }
  }

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
      const { name, CNPJ, email, password, phone, BusinessAddress } = req.body;

      const fieldsToUpdate = { name, CNPJ, email, password, phone, BusinessAddress };
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

  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado. Autenticação necessária." });
        return;
      }

      const companyId = req.user.id;
      const company = await repo.findCompanyById(companyId);

      if (!company) {
        res.status(404).json({ message: "Empresa não encontrada." });
        return;
      }

      const drawRepo = new DrawRepository();
      const draws = await drawRepo.getCompanyDraws(companyId);
      const { password, ...safeCompanyData } = company;

      res.json({
        ...safeCompanyData,
        draws
      });

    } catch (error) {
      console.error('Erro no getMe:', error);
      res.status(500).json({
        message: "Erro ao buscar dados da empresa",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  static async updateMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado. Empresa não autenticada." });
        return;
      }

      const companyId = req.user.id;
      const { name, CNPJ, email, phone, BusinessAddress, password } = req.body;

      // Verifique se o email já está em uso
      if (email) {
        const existingCompany = await repo.findCompanyByEmail(email);
        if (existingCompany && existingCompany.id !== companyId) {
          res.status(409).json({ message: "Email já está em uso." });
          return;
        }
      }

      const updateData = { name, CNPJ, email, phone, BusinessAddress, password };
      const updatedCompany = await repo.updateCompany(companyId, updateData);

      if (!updatedCompany) {
        res.status(404).json({ message: "Empresa não encontrada." });
        return;
      }

      const { password: _, ...safeCompanyData } = updatedCompany;
      res.json({
        message: "Empresa atualizada com sucesso!",
        company: safeCompanyData,
      });

    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      res.status(500).json({
        message: "Erro ao atualizar empresa",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const repo = new CompanyRepository();
  
      const company = await repo.findCompanyById(id);
      if (!company) return res.status(404).json({ message: "Empresa não encontrada" });
  
      // 1. Exclui todos os draws da empresa
      await AppDataSource
        .getRepository(Draw)
        .delete({ company: { id } });
  
      // 2. Exclui a empresa
      await repo.deleteCompany(id);
  
      return res.status(200).json({ message: "Conta removida com sucesso" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro interno ao deletar conta" });
    }
  }
}
