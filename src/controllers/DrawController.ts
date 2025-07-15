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
        return;
      }
      const draw = await repo.findDrawById(id);

      if (!draw) {
        res.status(404).json({ message: "Sorteio não encontrado" });
        return;
      }

      const response = {
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
        } : null
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar sorteio" });
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
      const deleted = await repo.deleteDraw(id);

      if (!deleted) {
        res.status(404).json({ message: "Sorteio não encontrado" });
        return;
      }

      res.json({ message: "Sorteio deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar sorteio" });
    }
  }

  static async enroll(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado." });
      }

      // Verificar se é usuário (não empresa)
      if (req.user.type !== 'user') {
        return res.status(403).json({ error: "Apenas usuários podem participar de sorteios" });
      }

      const drawId = parseInt(req.params.id);
      const result = await repo.enrollUser(drawId, req.user.id);

      res.json({ message: "Inscrição realizada com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
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
        return res.status(401).json({ message: "Não autorizado." });
      }

      const drawId = parseInt(req.params.id);
      const isEnrolled = await repo.checkUserEnrollment(drawId, req.user.id);
      res.json({ isEnrolled });
    } catch (error) {
      res.status(500).json({ error: "Erro ao verificar inscrição" });
    }
  }
}