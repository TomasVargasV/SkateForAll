import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    ManyToMany
} from "typeorm";
import bcrypt from "bcryptjs";
import { Draw } from "./Draw";

/**
 * User entity representing application users participating in draws.
 * Includes personal info, authentication, roles, and relations to draws.
 */
@Entity()
export class User {
    // Auto-generated primary key for the user
    @PrimaryGeneratedColumn()
    id!: number;

    // User's full name
    @Column({ nullable: false })
    name: string;

    // Unique email for login and contact
    @Column({ unique: true, nullable: false })
    email: string;

    // Hashed password for authentication
    @Column({ nullable: false })
    password: string;

    // Contact phone number
    @Column({ nullable: false })
    phone: string;

    // Unique Instagram handle
    @Column({ unique: true, nullable: false })
    instagram: string;

    // User's address
    @Column({ nullable: false })
    address: string;

    // User's state of residence
    @Column({ nullable: false })
    state: string;

    // Draws in which the user is enrolled
    @ManyToMany(() => Draw, draw => draw.enrolledUsers)
    draws!: Draw[];

    // Draws that the user has won
    @ManyToMany(() => Draw, draw => draw.winners)
    drawsWon!: Draw[];

    // Timestamp when the user was created
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    // Role of the user ('user' or 'admin')
    @Column({
        type: "enum",
        enum: ["user", "admin"],
        default: "user"
    })
    role: string;

    /**
     * Constructor to initialize new User instances.
     * Password will be hashed on insert/update.
     */
    constructor(
        role: string = 'user',
        name: string,
        email: string,
        password: string,
        phone: string,
        instagram: string,
        address: string,
        state: string
    ) {
        this.role = role;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.instagram = instagram;
        this.address = address;
        this.state = state;
    }

    /**
     * Hashes the password before saving to the database.
     * Runs on both insertion and updates.
     */
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
