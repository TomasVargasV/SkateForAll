import { AppDataSource } from "../dataSource";
import { User } from "../models/User";

/**
 * Repository handling CRUD operations for User entities.
 * Utilizes TypeORM DataSource for database interactions.
 */
export class UserRepository {
  // TypeORM repository instance for User model
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Creates and saves a new User record.
   * @param name - Full name of the user
   * @param email - Unique email for authentication
   * @param password - Plain-text password (hashed via entity hook)
   * @param phone - Contact phone number
   * @param instagram - Unique Instagram handle
   * @param address - Residential address
   * @param state - State of residence
   * @returns The saved User entity
   */
  async createUser(
    name: string,
    email: string,
    password: string,
    phone: string,
    instagram: string,
    address: string,
    state: string
  ) {
    const user = new User('user', name, email, password, phone, instagram, address, state);
    return await this.userRepository.save(user);
  }

  /**
   * Retrieves all users from the database.
   * @returns Array of User entities
   */
  async findAllUsers() {
    return await this.userRepository.find();
  }

  /**
   * Finds a user by ID, optionally loading their draws.
   * @param id - Primary key of the user
   * @param loadDraws - Whether to include related draws
   * @returns The User entity or undefined if not found
   */
  async findUserById(id: number, loadDraws: boolean = false) {
    const options = loadDraws ? { relations: ["draws"] } : {};
    return await this.userRepository.findOne({ where: { id }, ...options });
  }

  /**
   * Finds a user by their unique email.
   * @param email - Email to search for
   * @returns The User entity or undefined if not found
   */
  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * Updates specified fields of an existing user.
   * Ensures new email, if provided, is not already in use.
   * @param id - ID of the user to update
   * @param fieldsToUpdate - Partial User fields to modify
   * @returns The updated User entity or null if not found
   * @throws Error if the new email is taken by another user
   */
  async updateUser(id: number, fieldsToUpdate: Partial<User>) {
    const user = await this.findUserById(id);
    if (!user) return null;

    // Check for email uniqueness if updating email
    if (fieldsToUpdate.email && fieldsToUpdate.email !== user.email) {
      const existingUser = await this.findUserByEmail(fieldsToUpdate.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email já está em uso por outro usuário");
      }
    }

    Object.assign(user, fieldsToUpdate);
    return await this.userRepository.save(user);
  }

  /**
   * Deletes a user and clears their relations before removal.
   * @param id - ID of the user to delete
   * @returns The removed User entity or null if not found
   */
  async deleteUser(id: number) {
    // Load user with related draws to clear relations
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["draws", "drawsWon"]
    });

    if (!user) return null;

    // Clear many-to-many relations before deletion
    user.draws = [];
    user.drawsWon = [];
    await this.userRepository.save(user);

    // Remove the user record
    return await this.userRepository.remove(user);
  }
}
