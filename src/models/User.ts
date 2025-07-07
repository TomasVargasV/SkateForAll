import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany,
    BeforeInsert, BeforeUpdate,
    ManyToMany
} from "typeorm";
import bcrypt from "bcryptjs";
import { Draw } from "./Draw";

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

    @Column({ length: 50 })
    state: string;

    @ManyToMany(() => Draw, draw => draw.enrolledUsers)
    draws!: Draw[];


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
