import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

class CalendarService {
  // 1. Consumir la API de Calendarific
  static async fetchWorkingDaysFromCalendarific() {
    return new Promise((resolve, reject) => {
      const API_URL = `https://calendarific.com/api/v2/holidays?api_key=${process.env.CALENDARIFIC_API_KEY}&country=AR&year=2024`;

      https.get(API_URL, (response) => {
        let data = '';

        // Obtener datos en fragmentos
        response.on('data', (chunk) => (data += chunk));

        // Procesar la respuesta completa
        response.on('end', () => {
          const holidays = JSON.parse(data).response.holidays;

          // Filtrar días laborales (no feriados)
          const workingDays = holidays
            .filter((holiday) => holiday.type[0] !== 'National holiday')
            .map((day) => ({
              dia: new Date(day.date.iso).getDate(),
              mes: new Date(day.date.iso).getMonth() + 1,
              año: new Date(day.date.iso).getFullYear(),
              laboral: 'si',
              disponible: true,
            }));

          resolve(workingDays);
        });

        // Manejo de errores en la solicitud
        response.on('error', (err) => reject(err));
      });
    });
  }

  // 2. Guardar los datos en SheetDB
  static async saveWorkingDaysToSheetDB(workingDays) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${process.env.SHEETDB_LOGIN}:${process.env.SHEETDB_PASSWORD}`).toString('base64');
      const url = new URL(process.env.SHEETDB_URL);

      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data)));
      });

      req.on('error', (err) => reject(err));

      // Enviar los días laborales como JSON
      req.write(JSON.stringify(workingDays));
      req.end();
    });
  }
}

export default CalendarService;
