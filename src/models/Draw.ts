import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sorteios")
export class Draw {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  empresa: string;

  @Column()
  item: string;

  @Column()
  quantidade: number;

  @Column()
  resumo: string;

  @Column()
  videoUrl: string;

  @Column()
  imagemEmpresa: string;

  @CreateDateColumn()
  created_at!: Date;

  constructor(
    empresa: string,
    item: string,
    quantidade: number,
    resumo: string,
    videoUrl: string,
    imagemEmpresa: string,
    
  ) {
    this.empresa = empresa;
    this.item = item;
    this.quantidade = quantidade;
    this.resumo = resumo;
    this.videoUrl = videoUrl;
    this.imagemEmpresa = imagemEmpresa;
  }
}
