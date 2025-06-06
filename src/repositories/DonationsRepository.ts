import { AppDataSource } from "../dataSource";
import { Donation } from "../models/Donation";
import { User } from "../models/User";

export class DonationRepository {
  private donationRepository = AppDataSource.getRepository(Donation);

  async createDonation(item: string, description: string, itemStatus: string, image: string) {

    const donation = new Donation(item, description, itemStatus, image);

    return await this.donationRepository.save(donation);
  }
  async findAllDonations() {
    return await this.donationRepository.find({
      relations: ["donor", "recipient"]
    });
  };

  async findDonationById(id: number) {
    return await this.donationRepository.findOne({
      where: { id },
      relations: ["donor", "recipient"]
    });
  }


  async updateDonation(id: number, fieldsToUpdate: Partial<Donation>) {
    const donation = await this.findDonationById(id);
    if (!donation) return null;

    Object.assign(donation, fieldsToUpdate);
    return await this.donationRepository.save(donation);
  }

  async deleteDonation(id: number) {
    const donation = await this.findDonationById(id);
    if (!donation) return null;
    return await this.donationRepository.remove(donation);
  }

  async findDonationsMadeByUser(userId: number) {
    return await this.donationRepository.find({
      where: { donor: { id: userId } },
      relations: ["recipient"]
    });
  }

  async findDonationsReceivedByUser(userId: number) {
    return await this.donationRepository.find({
      where: { recipient: { id: userId } },
      relations: ["donor"]
    });
  }
}
