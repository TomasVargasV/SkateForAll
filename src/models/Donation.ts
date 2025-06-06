import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne
} from "typeorm";
import { User } from "../models/User";

@Entity()
export class Donation {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.donationsMade, { eager: true })
    donor!: User;

    @ManyToOne(() => User, user => user.donationsReceived, { eager: true })
    recipient!: User;

    @Column()
    item: string;

    @Column({ nullable: false })
    description: string;

    @Column({type: "enum", enum: ['novo', 'semi-novo', 'usado'], default: 'novo' })
    itemStatus?: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
    
    @Column({ nullable: false })
    image?: string;


    constructor(item: string, description: string, itemStatus?: string, image?: string) {
        this.item = item;
        this.description = description;
        if (itemStatus) this.itemStatus = itemStatus;
        this.image = image;

    }

}
