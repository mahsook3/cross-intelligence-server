import axios from 'axios';

export async function getEUTradeStatistics(hsnCode, year) {
    try {
        let response;
        let currentHsnCode = hsnCode.toString(); 

        while (currentHsnCode.length > 0) {
            response = await axios.get(`https://webgate.ec.europa.eu/flows/public/v1/stats?reporter=&partner=&product=${currentHsnCode}&years=${year}&includeUK=false&lang=EN`);
            if (response && response.data && response.data.rows && response.data.rows.length > 0) {
                return response.data;
            }
            currentHsnCode = currentHsnCode.slice(0, -1); 
        }

        return response ? response.data : {}; 
    } catch (error) {
        console.error('Error fetching EU trade statistics:', error);
        throw error;
    }
}