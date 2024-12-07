import express from 'express';
import dotenv from 'dotenv';
import CalendarController from './controllers/CalendarController.js';

dotenv.config();

const app = express();

// Middleware para JSON
app.use(express.json());

// Rutas
app.get('/api/working-days', CalendarController.getWorkingDays);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
