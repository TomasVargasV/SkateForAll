// Import the Express framework
import express from "express";
// Import route modules for users, companies, and draws
import UserRoutes from "./routes/UserRoutes";
import CompanyRoutes from "./routes/CompanyRoutes";
import DrawRoutes from "./routes/DrawRoutes";
// Import CORS middleware to allow cross-origin requests
import cors from "cors";
// Import database connection
import { AppDataSource } from "./dataSource";
// Import path module for handling file paths
import path from "path";
// Initialize the Express application
const app = express();
// Define the path to the public folder for serving static files
const publicPath = path.join(__dirname, "..", "public");
// Serve static files from the public folder
app.use(express.static(publicPath));
// Serve uploaded files from the /uploads directory
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
// Enable CORS for all requests
app.use(cors());
// Enable parsing of JSON request bodies
app.use(express.json());
// Serve the homepage from public/html/home.html when accessing the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "html", "home.html"));
});
// Mount route handlers under the /api path
app.use("/api", UserRoutes);
app.use("/api", CompanyRoutes);
app.use("/api", DrawRoutes);
// Initialize database connection and start the server
AppDataSource.initialize().then(() => {
  app.listen(3000, () => console.log("Server is running on port 3000"));
}).catch((error) => {
  console.log("Erro ao conectar ao banco de dados!", error);
});
