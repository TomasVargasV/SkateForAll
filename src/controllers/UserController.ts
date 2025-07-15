import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import { generateToken } from "../auth";

const repo = new UserRepository();

export class UserController {

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone, instagram, address, state } = req.body;

      const existing = await repo.findUserByEmail(email);
      if (existing) {
        res.status(409).json({ message: "Email já em uso." });
        return;
      }

      const user = await repo.createUser(name, email, password, phone, instagram, address, state);
      const token = generateToken({
        id: user.id,
        email: user.email,
        type: 'user'
      });

      res.status(201).json({ user: user, token });
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

      const token = generateToken({
        id: user.id,
        email: user.email,
        type: 'user'
      });

      res.json({ token, user: { ...user, role: user.role } });
      console.log("Login bem-sucedido:", token);;
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
    }
  }

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

  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado. Autenticação necessária." });
        return;
      }

      const userId = req.user.id;
      const user = await repo.findUserById(userId);

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      const { password, ...safeUserData } = user;
      res.json(safeUserData);

    } catch (error) {
      console.error('Erro no getMe:', error);
      res.status(500).json({
        message: "Erro ao buscar dados do usuário",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado. Usuário não autenticado." });
        return;
      }

      const userId = req.user.id;
      const { name, email, password, phone, instagram, address, state } = req.body;
      if (email) {
        const existingUser = await repo.findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          res.status(409).json({ message: "Email já está em uso." });
          return;
        }
      }

      const updateData = { name, email, password, phone, instagram, address, state };
      const updatedUser = await repo.updateUser(userId, updateData);

      if (!updatedUser) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      const safeUserData = updatedUser;

      res.json({
        message: "Usuário atualizado com sucesso!",
        user: safeUserData,
      });

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({
        message: "Erro ao atualizar usuário",
        error: error instanceof Error ? error.message : String(error)
      });
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

  static async getUserDraws(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const userId = req.user.id;
      const user = await repo.findUserById(userId, true);

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      const draws = user.draws || [];
      res.json(draws);
      return
    } catch (error) {
      console.error('Erro ao buscar sorteios do usuário:', error);
      res.status(500).json({
        message: "Erro ao buscar sorteios",
        error: error instanceof Error ? error.message : String(error)
      });
      return
    }
  }
}
