import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany,
    BeforeInsert, BeforeUpdate
} from "typeorm";
import bcrypt from "bcryptjs";
import { Donation } from "../models/Donation"; // ajuste o caminho conforme a estrutura do seu projeto

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ length: 100 })
    phone: string;

    @Column({ length: 100 })
    address: string;

    @Column({length: 50})
    state: string;

    @OneToMany(() => Donation, donation => donation.donor)
    donationsMade!: Donation[];

    @OneToMany(() => Donation, donation => donation.recipient)
    donationsReceived!: Donation[];

    constructor(name: string, email: string, password: string, phone: string, address: string, state: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.state = state;
        }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
