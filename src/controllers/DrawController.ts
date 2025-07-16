import { Request, Response } from "express";
import { DrawRepository } from "../repositories/DrawRepository";
import { CompanyRepository } from "../repositories/CompanyRepository";
import { Draw } from "../models/Draw";

// Instantiate repository for draw operations
const repo = new DrawRepository();

export class DrawController {
  // Create a new draw for the authenticated company
  static async create(req: Request, res: Response) {
    try {
      // Ensure user is logged in
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const companyId = req.user.id;
      const companyRepo = new CompanyRepository();
      // Fetch the company by ID
      const company = await companyRepo.findCompanyById(companyId);

      if (!company) {
        res.status(404).json({ message: "Empresa não encontrada." });
        return;
      }

      // Extract draw data from request body and file
      const { title, subtitle, includedItems, winnerCount, videoUrl } = req.body;
      const isActive = req.body.isActive === "true";
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      // Prepare partial Draw entity
      const drawData: Partial<Draw> = {
        title,
        subtitle,
        includedItems,
        winnerCount,
        image,
        videoUrl,
        isActive,
        company
      };

      // Create and return new draw
      const draw = await repo.createDraw(drawData);
      res.status(201).json(draw);
    } catch (error) {
      // Handle creation errors
      res.status(500).json({ error: "Erro ao criar sorteio" });
    }
  }

  // Retrieve all draws with simplified company data
  static async getAll(req: Request, res: Response) {
    try {
      const draws = await repo.findAllDraws();
      // Map draw entities to simplified objects
      const simplifiedDraws = draws.map(draw => ({
        id: draw.id,
        title: draw.title,
        subtitle: draw.subtitle,
        image: draw.image,
        includedItems: draw.includedItems,
        winnerCount: draw.winnerCount,
        videoUrl: draw.videoUrl,
        isActive: draw.isActive,
        createdAt: draw.createdAt,
        company: draw.company ? {
          id: draw.company.id,
          name: draw.company.name,
        } : null
      }));

      res.json(simplifiedDraws);
    } catch (error) {
      // Log and handle fetch errors
      console.error("Erro detalhado:", error);
      res.status(500).json({ error: "Erro ao buscar sorteios" });
    }
  }

  // Retrieve a specific draw by its ID, including participants
  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const draw = await repo.findDrawById(id);
      if (!draw) {
        res.status(404).json({ message: "Sorteio não encontrado" });
        return;
      }

      // Simplify enrolled users data
      const participants = draw.enrolledUsers?.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        instagram: u.instagram
      })) || [];

      // Return detailed draw info
      res.json({
        id: draw.id,
        title: draw.title,
        subtitle: draw.subtitle,
        includedItems: draw.includedItems,
        winnerCount: draw.winnerCount,
        image: draw.image,
        videoUrl: draw.videoUrl,
        hasVideo: !!draw.videoUrl,
        isActive: draw.isActive,
        createdAt: draw.createdAt,
        company: draw.company ? {
          id: draw.company.id,
          name: draw.company.name,
        } : null,
        participants
      });
      return;
    } catch (error) {
      // Handle errors during fetch by ID
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar sorteio" });
      return;
    }
  }

  // Update a draw by ID for authenticated company user
  static async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const id = parseInt(req.params.id);
      const updated = await repo.updateDraw(id, req.body);

      if (!updated) {
        res.status(404).json({ message: "Sorteio não encontrado" });
        return;
      }

      res.json(updated);
    } catch (error) {
      // Handle update errors
      res.status(500).json({ error: "Erro ao atualizar sorteio" });
    }
  }

  // Delete a draw if the requesting user owns it
  static async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const id = parseInt(req.params.id);
      const repo = new DrawRepository();
      const draw = await repo.findDrawById(id);

      if (!draw) {
        res.status(404).json({ message: "Sorteio não encontrado" });
        return;
      }

      // Check ownership before deletion
      if (draw.company.id !== req.user.id) {
        res.status(403).json({ message: "Você não tem permissão para deletar este sorteio." });
        return;
      }

      // Perform deletion
      const deleted = await repo.deleteDraw(id);
      res.json({ message: "Sorteio deletado com sucesso" });
      return;
    } catch (error) {
      // Handle deletion errors
      res.status(500).json({ error: "Erro ao deletar sorteio" });
      return;
    }
  }

  // Enroll authenticated user in a draw
  static async enroll(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      // Only regular users can enroll
      if (req.user.type !== 'user') {
        res.status(403).json({ error: "Apenas usuários podem participar de sorteios" });
        return;
      }

      const drawId = parseInt(req.params.id);
      const result = await repo.enrollUser(drawId, req.user.id);

      res.json({ message: "Inscrição realizada com sucesso" });
      return;
    } catch (error: any) {
      // Handle enrollment errors
      res.status(400).json({ error: error.message });
      return;
    }
  }

  // Unenroll authenticated user from a draw
  static async unenroll(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      // Only regular users can unenroll
      if (req.user.type !== 'user') {
        res.status(403).json({ error: "Apenas usuários podem se desinscrever de sorteios" });
        return;
      }

      const drawId = parseInt(req.params.id);
      const userId = req.user.id;

      const repo = new DrawRepository();
      const success = await repo.unenrollUser(drawId, userId);

      if (success) {
        res.json({ message: "Desinscrição realizada com sucesso" });
        return;
      } else {
        res.status(400).json({ error: "Não foi possível realizar a desinscrição" });
        return;
      }
    } catch (error: any) {
      // Handle unenrollment errors
      res.status(400).json({ error: error.message });
      return;
    }
  }

  // Retrieve all draws belonging to the authenticated company
  static async getCompanyDraws(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const draws = await repo.getCompanyDraws(req.user.id);
      res.json(draws);
    } catch (error) {
      // Handle fetch company draws errors
      res.status(500).json({ error: "Erro ao buscar sorteios" });
    }
  }

  // Check if authenticated user is enrolled in a specific draw
  static async checkEnrollment(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const drawId = parseInt(req.params.id);
      const isEnrolled = await repo.checkUserEnrollment(drawId, req.user.id);
      res.json({ isEnrolled });
      return;
    } catch (error) {
      // Handle check enrollment errors
      res.status(500).json({ error: "Erro ao verificar inscrição" });
      return;
    }
  }

  // Draw winners for a specific draw and return simplified user data
  static async drawWinners(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }
      const drawId = parseInt(req.params.id);
      const winners = await repo.drawWinners(drawId);
      // Simplify winner data
      const data = winners.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        instagram: u.instagram
      }));
      res.json({ winners: data });
      return;
    } catch (err: any) {
      // Determine status code based on error message and respond
      const status = err.message.includes("não encontrado") ? 404 : err.message.includes("encerrado") ? 400 : 500;
      res.status(status).json({ error: err.message });
      return;
    }
  }
}
