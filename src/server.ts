import express from "express";
import UserRoutes from "./routes/UserRoutes"
import CompanyRoutes from "./routes/CompanyRoutes"
import cors from "cors";
import { AppDataSource } from "./dataSource";
import path from "path";



const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
app.use("/api", UserRoutes);
app.use("/api", CompanyRoutes);

AppDataSource.initialize().then(() => {
  app.listen(3000, () => console.log("Server is running on port 3306"));
}).catch((error) => {
  console.log("Erro ao conectar ao banco de dados!", error)
});