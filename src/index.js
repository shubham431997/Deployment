import express from 'express';
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import apiRoutes from "./routes/apiRoutes.js";
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import os from 'os';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.use(cors({
  origin: '*',
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(os.homedir(), 'Desktop', 'uploads');

// API Route

app.use('/uploads', express.static(uploadsDir));
app.use('/api', apiRoutes);


const port = process.env.PORT || 4000;
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});
