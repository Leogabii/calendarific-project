import CalendarService from '../services/CalendarService.js';

class CalendarController {
  static async getWorkingDays(req, res) {
    try {
      const { country, year } = req.query;

      if (!country || !year) {
        return res.status(400).json({ message: 'Country y Year son requeridos' });
      }

      console.log(`Iniciando proceso para country: ${country}, year: ${year}`);

      // Paso 1: Obtener feriados
      const holidays = await CalendarService.fetchHolidays(country, year);
      console.log(`Feriados obtenidos: ${holidays.length}`);

      // Paso 2: Generar días laborales
      const workingDays = CalendarService.generateWorkingDays(holidays, year);
      console.log(`Días laborales generados: ${workingDays.length}`);

      // Paso 3: Guardar en SheetDB
      const result = await CalendarService.saveWorkingDaysToSheetDB(workingDays);
      console.log('Resultado de guardar en SheetDB:', result);

      res.status(200).json({
        message: 'Días laborales guardados exitosamente en SheetDB',
        data: result,
      });
    } catch (error) {
      console.error('Error en getWorkingDays:', error);
      res.status(500).json({
        message: 'Error al procesar los días laborales',
        error: error.message,
      });
    }
  }
}

export default CalendarController;
