import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Company } from "./Company";
import { User } from "./User";

@Entity()
export class Draw {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, company => company.draws)
  company!: Company;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column()
  title!: string;

  @Column()
  subtitle!: string;

  @Column('text')
  includedItems!: string;

  @Column()
  winnerCount!: number;

  @ManyToMany(() => User, user => user.draws)
  @JoinTable()
  enrolledUsers!: User[];

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}