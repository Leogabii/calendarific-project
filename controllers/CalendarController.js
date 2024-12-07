import CalendarService from '../services/CalendarService.js';

class CalendarController {
  static async getWorkingDays(req, res) {
    try {
      const country = req.query.country || 'AR'; // Por defecto: Argentina
      const year = parseInt(req.query.year, 10) || 2024; // Por defecto: 2024

      // Paso 1: Obtener feriados desde la API de Calendarific
      const holidays = await CalendarService.fetchHolidays(country, year);

      // Paso 2: Generar días laborales
      const workingDays = CalendarService.generateWorkingDays(holidays, year);

      // Paso 3: Guardar días laborales en SheetDB
      const result = await CalendarService.saveWorkingDaysToSheetDB(workingDays);

      res.status(200).json({
        message: 'Días laborales guardados exitosamente en SheetDB',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error al procesar los días laborales',
        error: error.message,
      });
    }
  }
}

export default CalendarController;
