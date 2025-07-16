import { Request, Response } from "express";
import { DrawRepository } from "../repositories/DrawRepository";
import { Company } from "../models/Company";
import { CompanyRepository } from "../repositories/CompanyRepository";
import { Draw } from "../models/Draw";
import { getRepository } from "typeorm";

const repo = new DrawRepository();

export class DrawController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const companyId = req.user.id;
      const companyRepo = new CompanyRepository();
      const company = await companyRepo.findCompanyById(companyId);

      if (!company) {
        res.status(404).json({ message: "Empresa não encontrada." });
        return;
      }

      const { title, subtitle, includedItems, winnerCount, videoUrl } = req.body;
      const isActive = req.body.isActive === "true";
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

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

      const draw = await repo.createDraw(drawData);
      res.status(201).json(draw);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar sorteio" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const draws = await repo.findAllDraws();
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
      console.error("Erro detalhado:", error);
      res.status(500).json({ error: "Erro ao buscar sorteios" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "ID inválido" });
        return
      }

      // já carrega enrolledUsers porque seu repo faz relations
      const draw = await repo.findDrawById(id);
      if (!draw) {
        res.status(404).json({ message: "Sorteio não encontrado" });
        return
      }

      // montar resposta incluindo dados básicos dos usuários
      const participants = draw.enrolledUsers?.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        instagram: u.instagram
      })) || [];

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
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar sorteio" });
      return
    }
  }

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
      res.status(500).json({ error: "Erro ao atualizar sorteio" });
    }
  }

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

      if (draw.company.id !== req.user.id) {
        res.status(403).json({ message: "Você não tem permissão para deletar este sorteio." });
        return;
      }

      const deleted = await repo.deleteDraw(id);
      res.json({ message: "Sorteio deletado com sucesso" });
      return
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar sorteio" });
      return
    }
  }

  static async enroll(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return
      }

      // Verificar se é usuário (não empresa)
      if (req.user.type !== 'user') {
        res.status(403).json({ error: "Apenas usuários podem participar de sorteios" });
        return
      }

      const drawId = parseInt(req.params.id);
      const result = await repo.enrollUser(drawId, req.user.id);

      res.json({ message: "Inscrição realizada com sucesso" });
      return
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return
    }
  }

  static async unenroll(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

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
        return
      } else {
        res.status(400).json({ error: "Não foi possível realizar a desinscrição" });
        return
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return
    }
  }

  static async getCompanyDraws(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const draws = await repo.getCompanyDraws(req.user.id);
      res.json(draws);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar sorteios" });
    }
  }

  static async checkEnrollment(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return
      }

      const drawId = parseInt(req.params.id);
      const isEnrolled = await repo.checkUserEnrollment(drawId, req.user.id);
      res.json({ isEnrolled });
      return
    } catch (error) {
      res.status(500).json({ error: "Erro ao verificar inscrição" });
      return
    }
  }

  static async drawWinners(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return
      }
      const drawId = parseInt(req.params.id);
      const winners = await repo.drawWinners(drawId);
      const data = winners.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        instagram: u.instagram
      }));
      res.json({ winners: data });
      return
    } catch (err: any) {
      const status = err.message.includes("não encontrado") ? 404 : err.message.includes("encerrado") ? 400 : 500;
      res.status(status).json({ error: err.message });
      return
    }
  }
}