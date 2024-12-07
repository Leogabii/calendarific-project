import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

class SheetDBService {
  static async saveLaborDays(laborDays) {
    const data = JSON.stringify(laborDays);
    const options = {
      hostname: 'sheetdb.io',
      path: `/api/v1/${process.env.SHEETDB_URL}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        Authorization: `Basic ${Buffer.from(`${process.env.SHEETDB_USER}:${process.env.SHEETDB_PASSWORD}`).toString('base64')}`,
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(JSON.parse(responseData));
          } else {
            reject(new Error(`Error: ${res.statusCode} - ${responseData}`));
          }
        });
      });

      req.on('error', (error) => reject(error));
      req.write(data);
      req.end();
    });
  }
}

export default SheetDBService;
