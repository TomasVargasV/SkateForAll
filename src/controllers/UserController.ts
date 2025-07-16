import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import { generateToken } from "../auth";

// Instantiate repository for user operations
const repo = new UserRepository();

export class UserController {

  // Register a new user and return auth token
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone, instagram, address, state } = req.body;

      // Check if email is already used
      const existing = await repo.findUserByEmail(email);
      if (existing) {
        res.status(409).json({ message: "Email já em uso." });
        return;
      }

      // Create user and generate JWT
      const user = await repo.createUser(name, email, password, phone, instagram, address, state);
      const token = generateToken({ id: user.id, email: user.email, type: 'user' });

      // Respond with created user and token
      res.status(201).json({ user, token });
      return;
    } catch (error) {
      // Handle registration errors
      res.status(500).json({ error: "Erro ao registrar usuário", details: error });
      return;
    }
  }

  // Authenticate a user and return auth token
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log("Tentando login para:", email);

      // Find user by email
      const user = await repo.findUserByEmail(email);
      if (!user) {
        console.log("Usuário não encontrado");
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        console.log("Senha inválida");
        res.status(401).json({ message: "Senha inválida." });
        return;
      }

      // Generate JWT for valid credentials
      const token = generateToken({ id: user.id, email: user.email, type: 'user' });

      // Respond with token and user info
      res.json({ token, user: { ...user, role: user.role } });
      console.log("Login bem-sucedido:", token);
    } catch (error: any) {
      // Handle login errors
      console.error("Erro no login:", error);
      res.status(500).json({
        message: "Erro ao fazer login",
        details: { message: error?.message || "Erro desconhecido", stack: error?.stack || null, raw: error }
      });
    }
  }

  // Retrieve all users
  static async getAll(req: Request, res: Response) {
    try {
      const users = await repo.findAllUsers();
      res.json(users);
      return;
    } catch (error) {
      // Handle fetch errors
      res.status(500).json({ message: "Erro ao buscar usuários", details: error });
      return;
    }
  }

  // Retrieve a user by ID
  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await repo.findUserById(id);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.json(user);
    } catch (error) {
      // Handle fetch by ID errors
      res.status(500).json({ message: "Erro ao buscar usuário", details: error });
      return;
    }
  }

  // Retrieve authenticated user's profile (excluding password)
  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      // Ensure user is authenticated
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

      // Exclude password before responding
      const { password, ...safeUserData } = user;
      res.json(safeUserData);
    } catch (error) {
      // Handle getMe errors
      console.error('Erro no getMe:', error);
      res.status(500).json({ message: "Erro ao buscar dados do usuário", error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Update authenticated user's data
  static async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado. Usuário não autenticado." });
        return;
      }

      const userId = req.user.id;
      const { name, email, password, phone, instagram, address, state } = req.body;

      // Ensure new email is unique
      if (email) {
        const existingUser = await repo.findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          res.status(409).json({ message: "Email já está em uso." });
          return;
        }
      }

      // Perform update
      const updateData = { name, email, password, phone, instagram, address, state };
      const updatedUser = await repo.updateUser(userId, updateData);
      if (!updatedUser) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      // Respond with updated user data
      res.json({ message: "Usuário atualizado com sucesso!", user: updatedUser });
    } catch (error) {
      // Handle update errors
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: "Erro ao atualizar usuário", error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Delete authenticated user's account
  static async deleteMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado. Usuário não autenticado." });
        return;
      }

      const userId = req.user.id;
      const deleted = await repo.deleteUser(userId);
      if (!deleted) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.json({ message: "Usuário deletado com sucesso." });
      return;
    } catch (error) {
      // Handle delete errors
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: "Erro ao deletar usuário", details: error instanceof Error ? error.message : String(error) });
      return;
    }
  }

  // Retrieve draws associated with the authenticated user
  static async getUserDraws(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const userId = req.user.id;
      // Fetch user along with draws
      const user = await repo.findUserById(userId, true);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      const draws = user.draws || [];
      res.json(draws);
      return;
    } catch (error) {
      // Handle fetch user draws errors
      console.error('Erro ao buscar sorteios do usuário:', error);
      res.status(500).json({ message: "Erro ao buscar sorteios", error: error instanceof Error ? error.message : String(error) });
      return;
    }
  }
}
