import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

class CalendarService {
  // Método para guardar días laborales en SheetDB
  static async saveWorkingDaysToSheetDB(workingDays) {
    try {
      const response = await fetch(process.env.SHEETDB_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${process.env.SHEETDB_USER}:${process.env.SHEETDB_PASSWORD}`).toString('base64')}`,
        },
        body: JSON.stringify(workingDays),
      });

      if (!response.ok) {
        throw new Error('Error al guardar en SheetDB');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al guardar en SheetDB:', error.message);
      throw new Error('No se pudo guardar en SheetDB.');
    }
  }
}

export default CalendarService;
