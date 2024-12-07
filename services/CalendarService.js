import fetch from 'node-fetch'; // Importa el módulo completo

class CalendarService {
  // Paso 1: Obtener feriados desde la API de Calendarific
  static async fetchHolidays(country, year) {
    const API_KEY = process.env.CALENDARIFIC_API_KEY;
    const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}`;

    const response = await fetch(url); // Usamos fetch del módulo completo
    if (!response.ok) {
      throw new Error(`Error al obtener feriados: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response.holidays;
  }

  // Paso 2: Generar días laborales
  static generateWorkingDays(holidays, year) {
    const holidaysSet = new Set(
      holidays
        .filter((holiday) => holiday.type.includes('National holiday'))
        .map((holiday) => holiday.date.iso)
    );

    const workingDays = [];
    const startDate = new Date(year, 0, 1); // 1 de enero
    const endDate = new Date(year, 11, 31); // 31 de diciembre

    for (let current = startDate; current <= endDate; current.setDate(current.getDate() + 1)) {
      const day = current.getDay(); // 0 = Domingo, 6 = Sábado
      const dateString = current.toISOString().split('T')[0];

      if (day !== 0 && day !== 6 && !holidaysSet.has(dateString)) {
        workingDays.push({
          dia: current.getDate(),
          mes: current.getMonth() + 1,
          año: current.getFullYear(),
          laboral: 'si',
          disponible: true,
        });
      }
    }

    return workingDays;
  }

  // Paso 3: Guardar días laborales en SheetDB
  static async saveWorkingDaysToSheetDB(workingDays) {
    const SHEETDB_URL = process.env.SHEETDB_URL;
    const SHEETDB_LOGIN = process.env.SHEETDB_LOGIN;
    const SHEETDB_PASSWORD = process.env.SHEETDB_PASSWORD;

    const response = await fetch(SHEETDB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${SHEETDB_LOGIN}:${SHEETDB_PASSWORD}`).toString(
          'base64'
        )}`,
      },
      body: JSON.stringify(workingDays),
    });

    if (!response.ok) {
      throw new Error(`Error al guardar en SheetDB: ${response.statusText}`);
    }

    return await response.json();
  }
}

export default CalendarService;
