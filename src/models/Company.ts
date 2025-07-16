import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BeforeInsert,
    BeforeUpdate
} from "typeorm";
import bcrypt from "bcryptjs";
import { Draw } from "./Draw";

/**
 * Company entity representing companies participating in draws.
 * Includes fields for company details, authentication, and relations to draws.
 */
@Entity()
export class Company {
    // Auto-generated primary key
    @PrimaryGeneratedColumn()
    id!: number;

    // Company's display name (max 100 characters)
    @Column({ length: 100 })
    name: string;

    // Unique company registration number
    @Column({ unique: true })
    CNPJ: string;

    // Unique contact email for the company
    @Column({ unique: true })
    email: string;

    // Contact phone number (max 100 characters)
    @Column({ length: 100 })
    phone: string;

    // Company's business address (max 100 characters)
    @Column({ length: 100 })
    BusinessAddress: string;

    // Hashed password for authentication
    @Column()
    password: string;

    // Timestamp of when the company was created (auto-generated)
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    // One-to-many relation: a company can have multiple draws
    @OneToMany(() => Draw, draw => draw.company)
    draws!: Draw[];

    /**
     * Constructor to initialize a new Company instance.
     * Password will be hashed before insertion/update.
     */
    constructor(
        name: string,
        CNPJ: string,
        email: string,
        password: string,
        phone: string,
        BusinessAddress: string
    ) {
        this.name = name;
        this.CNPJ = CNPJ;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.BusinessAddress = BusinessAddress;
    }

    /**
     * Lifecycle hook to hash the password before saving to the database.
     * Applies on both insert and update operations.
     */
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
