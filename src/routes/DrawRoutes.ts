import { Router, response } from "express";
import { DrawController } from "../controllers/DrawController";
import { Request, Response } from "express";
import { request } from "http";


const drawRoutes = Router();

const controller = new DrawController();


drawRoutes.post("/create", controller.create.bind);
drawRoutes.get("/list", controller.list.bind);
drawRoutes.delete("/:id", controller.delete.bind)

export default drawRoutes;
