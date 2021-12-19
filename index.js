const got = require('got');
require('dotenv').config();

const getCurrentPrice = async () => {
    const startDate = new Date().setMinutes(0);
    const endDate = new Date().setMinutes(59);

    const apiUrl = `${process.env.API_BASE_URL}?start_date=${new Date(startDate)
        .toISOString()
        .slice(0, 16)}&end_date=${new Date(endDate).toISOString().slice(0, 16)}&time_trunc=hour`;

    const response = await got(apiUrl);
    const priceSpot = JSON.parse(response.body).included.find((type) => type.type === 'Precio mercado spot (€/MWh)');
    const finalPrice = priceSpot.attributes.values[0].value;

    return finalPrice;
};
