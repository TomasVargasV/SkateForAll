import { AppDataSource } from "../dataSource";
import { Draw } from "../models/Draw";
import { User } from "../models/User";

/**
 * Repository handling CRUD operations and enrollments for Draw entities.
 * Utilizes TypeORM DataSource to manage database interactions.
 */
export class DrawRepository {
    // TypeORM repository instances for Draw and User models
    private drawRepository = AppDataSource.getRepository(Draw);
    private userRepository = AppDataSource.getRepository(User);

    /**
     * Creates and saves a new draw in the database.
     * Ensures the drawData includes an associated company.
     * @param drawData - Partial Draw object with company and draw details
     * @returns The saved Draw entity
     * @throws Error if no company is provided
     */
    async createDraw(drawData: Partial<Draw>) {
        if (!drawData.company) {
            throw new Error("Empresa não associada ao sorteio");
        }
        const draw = this.drawRepository.create(drawData);
        return await this.drawRepository.save(draw);
    }

    /**
     * Retrieves all draws, including their associated company data.
     * @returns Array of Draw entities
     */
    async findAllDraws() {
        return await this.drawRepository.find({
            relations: ["company"]
        });
    }

    /**
     * Finds a specific draw by its ID, including company and enrolled users.
     * @param id - Primary key of the draw
     * @returns The Draw entity or undefined if not found
     */
    async findDrawById(id: number) {
        return await this.drawRepository.findOne({
            where: { id },
            relations: ["company", "enrolledUsers"]
        });
    }

    /**
     * Updates fields of an existing draw.
     * Prevents reactivating a finished draw.
     * @param id - ID of the draw to update
     * @param fieldsToUpdate - Partial Draw fields to modify
     * @returns Updated Draw or null if not found
     * @throws Error if attempting to activate a finished draw
     */
    async updateDraw(id: number, fieldsToUpdate: Partial<Draw>) {
        const draw = await this.findDrawById(id);
        if (!draw) return null;
        if (draw.isFinished && fieldsToUpdate.isActive) {
            throw new Error("Não é possível ativar um sorteio encerrado");
        }

        Object.assign(draw, fieldsToUpdate);
        return await this.drawRepository.save(draw);
    }

    /**
     * Deletes a draw by its ID.
     * @param id - ID of the draw to delete
     * @returns Removed Draw entity or null if not found
     */
    async deleteDraw(id: number) {
        const draw = await this.findDrawById(id);
        if (!draw) return null;

        return await this.drawRepository.remove(draw);
    }

    /**
     * Enrolls a user in a draw.
     * @param drawId - ID of the target draw
     * @param userId - ID of the user enrolling
     * @returns true on success
     * @throws Error if draw or user not found or user already enrolled
     */
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

    /**
     * Removes a user's enrollment from a draw.
     * @param drawId - ID of the draw
     * @param userId - ID of the user to unenroll
     * @returns true on success
     * @throws Error if draw not found or user not enrolled
     */
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

    /**
     * Checks if a user is enrolled in a specific draw.
     * @param drawId - ID of the draw
     * @param userId - ID of the user
     * @returns Boolean indicating enrollment status
     */
    async checkUserEnrollment(drawId: number, userId: number): Promise<boolean> {
        const draw = await this.drawRepository.findOne({
            where: { id: drawId },
            relations: ["enrolledUsers"]
        });

        if (!draw) return false;
        return draw.enrolledUsers?.some(user => user.id === userId) || false;
    }

    /**
     * Retrieves all draws created by a specific company.
     * Includes enrolled users and company data.
     * @param companyId - ID of the company
     * @returns Array of Draw entities
     */
    async getCompanyDraws(companyId: number) {
        return await this.drawRepository.find({
            where: { company: { id: companyId } },
            relations: ["enrolledUsers", "company"]
        });
    }

    /**
     * Selects random winners for a draw and marks it as finished.
     * @param drawId - ID of the draw
     * @returns Array of winning User entities
     * @throws Error if draw not found, inactive, or insufficient participants
     */
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

        // Shuffle participants and select winners
        const shuffled = draw.enrolledUsers
            .map(u => ({ sort: Math.random(), user: u }))
            .sort((a, b) => a.sort - b.sort)
            .map(o => o.user);
        const winners = shuffled.slice(0, draw.winnerCount);

        // Update draw status and save
        draw.winners = winners;
        draw.isActive = false;
        draw.isFinished = true;

        await this.drawRepository.save(draw);
        return winners;
    }
}
