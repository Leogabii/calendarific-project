import CalendarService from '../services/CalendarService.js';

class CalendarController {
  static async getWorkingDays(req, res) {
    try {
      // Paso 1: Obtener días laborales desde la API de Calendarific
      const workingDays = await CalendarService.fetchWorkingDaysFromCalendarific();

      // Paso 2: Guardar los días laborales en SheetDB
      const result = await CalendarService.saveWorkingDaysToSheetDB(workingDays);

      // Paso 3: Responder con éxito
      res.status(200).json({
        message: 'Días laborales obtenidos y guardados exitosamente en SheetDB',
        data: result,
      });
    } catch (error) {
      // Manejo de errores
      res.status(500).json({
        message: 'Error al procesar los días laborales',
        error: error.message,
      });
    }
  }
}

export default CalendarController;
