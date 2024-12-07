import express from 'express';
import CalendarController from './controllers/CalendarController.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(express.json());

// Rutas
app.get('/api/holidays', CalendarController.getWorkingDays);

// Puerto desde .env
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
