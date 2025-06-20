import { Request, Response } from "express";
import { DrawRepository } from "../repositories/DrawRepository";

export class DrawController {
  async create(req: Request, res: Response): Promise<Response> {
    const { empresa, item, quantidade, resumo, videoUrl, imagemEmpresa} = req.body;

    try {
      const draw = DrawRepository.create({
        empresa,
        item,
        quantidade,
        resumo,
        videoUrl,
        imagemEmpresa,
      });

      await DrawRepository.save(draw);

      return res.status(201).json(draw);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar sorteio", error });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const draws = await DrawRepository.find({ order: { created_at: "DESC" } });
      return res.json(draws);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao listar sorteios", error });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const draw = await DrawRepository.findOneBy({ id });

      if (!draw) {
        return res.status(404).json({ message: "Sorteio não encontrado" });
      }

      await DrawRepository.remove(draw);
      return res.status(204).send(); 
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar sorteio", error });
    }
  }
}
    