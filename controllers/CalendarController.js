import express from 'express';
import CalendarService from '../services/CalendarService.js';

const router = express.Router();
const calendarService = new CalendarService();

// Ruta para obtener feriados
router.get('/', async (req, res) => {
    try {
        const { country = 'US', year = new Date().getFullYear() } = req.query;
        const holidays = await calendarService.getHolidays(country, year);
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
