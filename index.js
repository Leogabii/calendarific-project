import express from 'express';
import dotenv from 'dotenv';
import CalendarService from './services/CalendarService.js';

// Configuración de dotenv para cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const calendarService = new CalendarService();

// Helper para generar todos los días laborables del año
function generateWorkingDays(year, holidays) {
    const workingDays = [];
    const holidaySet = new Set(
        holidays.map(holiday => holiday.fecha.iso) // Crear un conjunto con las fechas de los feriados
    );

    for (let month = 1; month <= 12; month++) {
        const daysInMonth = new Date(year, month, 0).getDate(); // Obtener el número de días en el mes
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day); // Crear la fecha
            const isoDate = date.toISOString().split('T')[0];

            // Excluir sábados, domingos y feriados
            if (date.getDay() !== 0 && date.getDay() !== 6 && !holidaySet.has(isoDate)) {
                workingDays.push({
                    fecha: isoDate,
                    dia: day,
                    mes: month,
                    año: year
                });
            }
        }
    }

    return workingDays;
}

// Endpoint para obtener los días laborables
app.get('/api/working-days', async (req, res) => {
    try {
        const { country, year } = req.query;

        // Validación de parámetros
        if (!country || !year) {
            return res.status(400).json({ error: 'País y año son requeridos.' });
        }

        // Consumir la API de Calendarific
        const holidays = await calendarService.getHolidays(country, year);

        // Generar días laborables
        const workingDays = generateWorkingDays(year, holidays);

        return res.json(workingDays);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
