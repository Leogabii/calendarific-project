import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

class CalendarService {
    constructor() {
        this.apiKey = process.env.CALENDARIFIC_API_KEY; // Clave de la API desde .env
        this.baseUrl = 'https://calendarific.com/api/v2';
    }

    async getHolidays(country, year) {
        try {
            const url = `${this.baseUrl}/holidays?api_key=${this.apiKey}&country=${country}&year=${year}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Error al obtener los datos de Calendarific');
            }

            const data = await response.json();
            return data.response.holidays; // Retornamos los feriados
        } catch (error) {
            throw new Error(`Error en CalendarService: ${error.message}`);
        }
    }
}

export default CalendarService;
