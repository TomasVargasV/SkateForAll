import { Repository } from "typeorm";
import { AppDataSource } from "../dataSource";
import { Draw } from "../models/Draw";

export const DrawRepository: Repository<Draw> = AppDataSource.getRepository(Draw);
