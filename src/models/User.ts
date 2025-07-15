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

    @Column({ nullable: false })
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    phone: string;

    @Column({ unique: true, nullable: false })
    instagram: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    state: string;

    @ManyToMany(() => Draw, draw => draw.enrolledUsers)
    draws!: Draw[];

    @ManyToMany(() => Draw, draw => draw.winners)
    drawsWon!: Draw[];

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({
        type: "enum",
        enum: ["user", "admin"],
        default: "user"
    })
    role: string;

    constructor(role: string = 'user', name: string, email: string, password: string, phone: string, instagram: string, address: string, state: string) {
        this.role = role;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.instagram = instagram;
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
