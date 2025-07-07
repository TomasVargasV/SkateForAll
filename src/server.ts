import express from "express";
import UserRoutes from "./routes/UserRoutes";
import CompanyRoutes from "./routes/CompanyRoutes";
import DrawRoutes from "./routes/DrawRoutes"; 
import cors from "cors";
import { AppDataSource } from "./dataSource";
import path from "path";

const app = express();

const publicPath = path.join(__dirname, "..", "public");

app.use(express.static(publicPath));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "home.html"));
});

app.use("/api", UserRoutes);
app.use("/api", CompanyRoutes);
app.use("/api", DrawRoutes); 

AppDataSource.initialize().then(() => {
  app.listen(3000, () => console.log("Server is running on port 3000"));
}).catch((error) => {
  console.log("Erro ao conectar ao banco de dados!", error);
});
