import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Company } from "./Company";
import { User } from "./User";

@Entity()
export class Draw {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, company => company.draws, { eager: true, nullable: false })
  company!: Company;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  subtitle!: string;

  @Column('text', { nullable: false })
  includedItems!: string;

  @Column({ nullable: false })
  winnerCount!: number;

  @Column({ nullable: false })
  image!: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @ManyToMany(() => User, user => user.draws)
  @JoinTable()
  enrolledUsers!: User[];

  @Column({ default: false })
  isActive!: boolean;

  @Column({ default: false })
  isFinished!: boolean;

  @ManyToMany(() => User, user => user.drawsWon)
  @JoinTable({ name: "draw_winners" })
  winners!: User[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}