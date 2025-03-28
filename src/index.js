import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import apiRoutes from './routes/apiRoutes.js';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import fs from 'fs';
import notificationService from "./services/notification.service.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: '*' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the uploads directory inside `src`
const uploadsDir = path.join(__dirname, 'src', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files as static assets
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api', apiRoutes);

const port = process.env.PORT || 4000;
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

