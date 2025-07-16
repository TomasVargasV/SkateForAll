import { getRepository } from "typeorm";
import { AppDataSource } from "../dataSource";
import { Draw } from "../models/Draw";
import { User } from "../models/User";

export class DrawRepository {
    private drawRepository = AppDataSource.getRepository(Draw);
    private userRepository = AppDataSource.getRepository(User);

    async createDraw(drawData: Partial<Draw>) {
        if (!drawData.company) {
            throw new Error("Empresa não associada ao sorteio");
        }
        const draw = this.drawRepository.create(drawData);
        return await this.drawRepository.save(draw);
    }

    async findAllDraws() {
        return await this.drawRepository.find({
            relations: ["company"]
        });
    }

    async findDrawById(id: number) {
        return await this.drawRepository.findOne({
            where: { id },
            relations: ["company", "enrolledUsers"]
        });
    }

    async updateDraw(id: number, fieldsToUpdate: Partial<Draw>) {
        const draw = await this.findDrawById(id);
        if (!draw) return null;
        if (draw.isFinished && fieldsToUpdate.isActive) {
            throw new Error("Não é possível ativar um sorteio encerrado");
        }

        Object.assign(draw, fieldsToUpdate);
        return await this.drawRepository.save(draw);
    }

    async deleteDraw(id: number) {
        const draw = await this.findDrawById(id);
        if (!draw) return null;

        return await this.drawRepository.remove(draw);
    }

    async enrollUser(drawId: number, userId: number): Promise<boolean> {
        const draw = await this.drawRepository.findOne({
            where: { id: drawId },
            relations: ["enrolledUsers"]
        });

        if (!draw) throw new Error("Sorteio não encontrado");

        const alreadyEnrolled = draw.enrolledUsers?.some(user => user.id === userId);
        if (alreadyEnrolled) {
            throw new Error("Usuário já está inscrito neste sorteio");
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error("Usuário não encontrado");

        if (!draw.enrolledUsers) draw.enrolledUsers = [];
        draw.enrolledUsers.push(user);
        await this.drawRepository.save(draw);

        return true;
    }

    async unenrollUser(drawId: number, userId: number): Promise<boolean> {
        const draw = await this.drawRepository.findOne({
            where: { id: drawId },
            relations: ["enrolledUsers"]
        });

        if (!draw) throw new Error("Sorteio não encontrado");

        const userIndex = draw.enrolledUsers?.findIndex(user => user.id === userId);
        if (userIndex === -1 || userIndex === undefined) {
            throw new Error("Usuário não está inscrito neste sorteio");
        }

        draw.enrolledUsers = draw.enrolledUsers?.filter(user => user.id !== userId);
        await this.drawRepository.save(draw);

        return true;
    }

    async checkUserEnrollment(drawId: number, userId: number): Promise<boolean> {
        const draw = await this.drawRepository.findOne({
            where: { id: drawId },
            relations: ["enrolledUsers"]
        });

        if (!draw) return false;
        return draw.enrolledUsers?.some(user => user.id === userId) || false;
    }

    async getCompanyDraws(companyId: number) {
        return await this.drawRepository.find({
            where: { company: { id: companyId } },
            relations: ["enrolledUsers", "company"]
        });
    }

    async drawWinners(drawId: number): Promise<User[]> {
        const draw = await this.drawRepository.findOne({
            where: { id: drawId },
            relations: ["enrolledUsers", "winners"]
        });
        if (!draw) throw new Error("Sorteio não encontrado");
        if (!draw.isActive) throw new Error("Sorteio inativo");
        const totalInscritos = draw.enrolledUsers.length;
        if (totalInscritos < draw.winnerCount) {
            throw new Error("Número de inscritos menor que número de ganhadores");
        }
        const shuffled = draw.enrolledUsers
            .map(u => ({ sort: Math.random(), user: u }))
            .sort((a, b) => a.sort - b.sort)
            .map(o => o.user);
        const winners = shuffled.slice(0, draw.winnerCount);

        draw.winners = winners;
        draw.isActive = false;
        draw.isFinished = true;

        await this.drawRepository.save(draw);
        return winners;
    }
}