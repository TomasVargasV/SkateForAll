import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany,
    BeforeInsert, BeforeUpdate
} from "typeorm";
import bcrypt from "bcryptjs";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    CNPJ: number;

    @Column({ unique: true })
    email: string;

    @Column({ length: 100 })
    phone: string;

    @Column({ length: 100 })
    BusinessAddress: string;

    @Column()
    password: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;


    constructor(name: string,CNPJ:number, email: string, password: string, phone: string, BusinessAddress: string) {
        this.name = name;
        this.CNPJ = CNPJ;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.BusinessAddress = BusinessAddress;
        }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
