import { Request, Response } from "express";
import { DrawRepository } from "../repositories/DrawRepository";

const repo = new DrawRepository();

export class DrawController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const { title, subtitle, includedItems, winnerCount } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      const drawData = { title, subtitle, includedItems, winnerCount, image };

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
        winnerCount: draw.winnerCount
      }));

      res.json(simplifiedDraws);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar sorteios" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const draw = await repo.findDrawById(id);

      if (!draw) {
        res.status(404).json({ message: "Sorteio não encontrado" });
        return;
      }

      res.json(draw);
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
        res.status(401).json({ message: "Não autorizado." });
        return;
      }

      const drawId = parseInt(req.params.id);
      const result = await repo.enrollUser(drawId, req.user.id);

      if (!result) {
        res.status(404).json({ message: "Sorteio não encontrado" });
        return;
      }

      res.json({ message: "Inscrição realizada com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro na inscrição" });
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
}