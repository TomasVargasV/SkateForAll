import { AppDataSource } from "../dataSource";
import { User } from "../models/User";

export class UserRepository {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(name: string, email: string, password: string, phone: string, instagram: string, address: string, state: string) {
    const user = new User('user', name, email, password, phone, instagram, address, state);
    return await this.userRepository.save(user);
  }

  async findAllUsers() {
    return await this.userRepository.find();
  }

  async findUserById(id: number, loadDraws: boolean = false) {
  const options = loadDraws ? { relations: ["draws"] } : {};
  return await this.userRepository.findOne({ where: { id }, ...options });
}

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, fieldsToUpdate: Partial<User>) {
    const user = await this.findUserById(id);
    if (!user) return null;

    if (fieldsToUpdate.email && fieldsToUpdate.email !== user.email) {
      const existingUser = await this.findUserByEmail(fieldsToUpdate.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email já está em uso por outro usuário");
      }
    }

    Object.assign(user, fieldsToUpdate);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.findUserById(id);
    if (!user) return null;

    return await this.userRepository.remove(user);
  }
}
