import SheetDBService from '../services/SheetDBService.js';
import CalendarService from '../services/CalendarService.js';

class CalendarController {
  static async getLaborDays(req, res) {
    try {
      const { country, year } = req.query;
      const holidays = await CalendarService.fetchHolidays(country, year);

      const laborDays = CalendarService.filterLaborDays(holidays, year);

      // Convertimos los días laborales al formato requerido por SheetDB
      const sheetData = laborDays.map((day) => ({
        día: day.día,
        mes: day.mes,
        año: day.año,
        laboral: 'sí',
        disponible: true,
      }));

      // Guardamos los datos en SheetDB
      await SheetDBService.saveLaborDays(sheetData);

      res.json(sheetData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default CalendarController;
