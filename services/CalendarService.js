import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Configuración de dotenv para cargar variables de entorno
dotenv.config();

class CalendarService {
    constructor() {
        this.apiKey = process.env.CALENDARIFIC_API_KEY;
        this.baseUrl = 'https://calendarific.com/api/v2/holidays';
    }

    async getHolidays(country, year) {
        const url = `${this.baseUrl}?api_key=${this.apiKey}&country=${country}&year=${year}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al consumir la API de Calendarific');
        }

        const data = await response.json();
        return data.response.holidays.map(holiday => ({
            nombre: holiday.name,
            descripción: holiday.description,
            país: {
                id: holiday.country.id,
                nombre: holiday.country.name
            },
            fecha: {
                iso: holiday.date.iso,
                fechahora: {
                    año: holiday.date.datetime.year,
                    mes: holiday.date.datetime.month,
                    día: holiday.date.datetime.day
                }
            },
            tipo: holiday.type,
            primary_type: holiday.primary_type,
            canonical_url: holiday.canonical_url,
            urlid: holiday.urlid,
            locations: holiday.locations,
            states: holiday.states
        }));
    }
}

export default CalendarService;
