import express from 'express';
import dotenv from 'dotenv';
import CalendarController from './controllers/CalendarController.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rutas
app.use('/api/holidays', CalendarController);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
