import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import { generateToken } from "../auth";

const repo = new UserRepository();

export class UserController {


  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone, address, state} = req.body;

      const existing = await repo.findUserByEmail(email);
      if (existing) {
        res.status(409).json({ message: "Email já em uso." });
        return;
      }

      const user = await repo.createUser(name, email, password, phone, address, state);
      res.status(201).json(user);
      return;
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar usuário", details: error });
      return;
    }
  }

  
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log("Tentando login para:", email);
  
      const user = await repo.findUserByEmail(email);
      if (!user) {
        console.log("Usuário não encontrado");
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        console.log("Senha inválida");
        res.status(401).json({ message: "Senha inválida." });
        return;
      }
  
      const token = generateToken({ id: user.id, email: user.email });
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
      const users = await repo.findAllUsers();
      res.json(users);
      return;
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários", details: error });
      return;
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = await repo.findUserById(id);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuário", details: error });
      return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, email, password, createdAt } = req.body;

      const fieldsToUpdate = { name, email, password, createdAt};
      const updated = await repo.updateUser(id, fieldsToUpdate);

      if (!updated) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.json({ message: "Usuário atualizado com sucesso.", updated });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário", details: error });
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await repo.deleteUser(id);

      if (!deleted) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.json({ message: "Usuário deletado com sucesso." });
      return;
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar usuário", details: error });
      return;
    }
  }

}
