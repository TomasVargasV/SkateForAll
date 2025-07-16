import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Company } from "./Company";
import { User } from "./User";

/**
 * Draw entity representing a raffle or giveaway event.
 * Includes relations to Company (creator) and Users (participants and winners).
 */
@Entity()
export class Draw {
  // Auto-generated primary key for each draw
  @PrimaryGeneratedColumn()
  id!: number;

  // Many-to-one relation: each draw belongs to one company
  // Eagerly loads company data; not nullable
  @ManyToOne(() => Company, company => company.draws, { eager: true, nullable: false })
  company!: Company;

  // Title of the draw
  @Column({ nullable: false })
  title!: string;

  // Subtitle or description of the draw
  @Column({ nullable: false })
  subtitle!: string;

  // List of items included in the prize, stored as text
  @Column('text', { nullable: false })
  includedItems!: string;

  // Number of winners to be selected
  @Column({ nullable: false })
  winnerCount!: number;

  // URL or path to the image representing the draw
  @Column({ nullable: false })
  image!: string;

  // Optional video URL related to the draw
  @Column({ nullable: true })
  videoUrl?: string;

  // Many-to-many relation: users enrolled in this draw
  @ManyToMany(() => User, user => user.draws)
  @JoinTable()
  enrolledUsers!: User[];

  // Flag indicating if the draw is currently active
  @Column({ default: false })
  isActive!: boolean;

  // Flag indicating if the draw has finished/winners drawn
  @Column({ default: false })
  isFinished!: boolean;

  // Many-to-many relation: users who have won this draw
  // Uses custom join table 'draw_winners'
  @ManyToMany(() => User, user => user.drawsWon)
  @JoinTable({ name: "draw_winners" })
  winners!: User[];

  // Timestamp of when the draw was created (auto-generated)
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
