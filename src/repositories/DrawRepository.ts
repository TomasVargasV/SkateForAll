import { AppDataSource } from "../dataSource";
import { Draw } from "../models/Draw";
import { User } from "../models/User";

export class DrawRepository {
    private drawRepository = AppDataSource.getRepository(Draw);

    async createDraw(drawData: Partial<Draw>) {
        const draw = this.drawRepository.create(drawData);
        return await this.drawRepository.save(draw);
    }

    async findAllDraws() {
        return await this.drawRepository.find({
            relations: ["company", "enrolledUsers"]
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

        Object.assign(draw, fieldsToUpdate);
        return await this.drawRepository.save(draw);
    }

    async deleteDraw(id: number) {
        const draw = await this.findDrawById(id);
        if (!draw) return null;

        return await this.drawRepository.remove(draw);
    }

    async enrollUser(drawId: number, userId: number) {
        const draw = await this.findDrawById(drawId);
        if (!draw) return null;

        // Verifica se o usuário já está inscrito
        if (!draw.enrolledUsers.some(user => user.id === userId)) {
            draw.enrolledUsers.push({ id: userId } as User);
            return await this.drawRepository.save(draw);
        }
        return draw;
    }

    async getCompanyDraws(companyId: number) {
        return await this.drawRepository.find({
            where: { company: { id: companyId } },
            relations: ["enrolledUsers"]
        });
    }
}