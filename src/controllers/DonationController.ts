import { Request, Response } from "express";
import { AppDataSource } from "../dataSource";
import { Donation } from "../models/Donation";
import { User } from "../models/User";
import { DonationRepository } from "../repositories/DonationsRepository";

export class DonationController {
  static async create(req: Request, res: Response) {
    const { title, description, itemStatus} = req.body;
    const image = req.file?.filename;
  
    try {
      const donation = new Donation(title, description, itemStatus, image);
      const savedDonation = await AppDataSource.getRepository(Donation).save(donation);
      return res.status(201).json(savedDonation);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao cadastrar doação", error });
    }
  };

  static async findAll(req: Request, res: Response) {
    try {
      const donations = await AppDataSource.getRepository(Donation).find({
        relations: ["donor", "recipient"]
      });
      return res.json(donations);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao buscar doações", error: err });
    }
  }

  static async findMine(req: Request, res: Response) {
    const userId = req.user.id;

    try {
      const donationRepo = AppDataSource.getRepository(Donation);

      const donationsMade = await donationRepo.find({
        where: { donor: { id: userId } },
        relations: ["recipient"]
      });

      const donationsReceived = await donationRepo.find({
        where: { recipient: { id: userId } },
        relations: ["donor"]
      });

      return res.json({ donationsMade, donationsReceived });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao buscar suas doações", error: err });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { item, description } = req.body;

    try {
      const donationRepo = AppDataSource.getRepository(Donation);
      const donation = await donationRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["donor"]
      });

      if (!donation)
        return res.status(404).json({ message: "Doação não encontrada" });

      if (donation.donor.id !== req.user.id)
        return res.status(403).json({ message: "Você não pode editar esta doação" });

      donation.item = item ?? donation.item;
      donation.description = description ?? donation.description;

      const updated = await donationRepo.save(donation);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar doação", error: err });
    }
  }
  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const donationRepo = AppDataSource.getRepository(Donation);
      const donation = await donationRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["donor"]
      });

      if (!donation)
        return res.status(404).json({ message: "Doação não encontrada" });

      if (donation.donor.id !== req.user.id)
        return res.status(403).json({ message: "Você não pode deletar esta doação" });

      await donationRepo.remove(donation);
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ message: "Erro ao deletar doação", error: err });
    }
  }
}
