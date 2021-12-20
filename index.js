const TelegramBot = require('node-telegram-bot-api');
const got = require('got');
require('dotenv').config();

// Telegram bot token
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

/**
 * Controls /currentPrice bot command.
 */
bot.onText(/\/currentPrice/, async (msg) => {
    const chatId = msg.chat.id;
    const price = (await getCurrentPrice())/1000;

    const today = new Date();
    const time = today.getHours() + ":" + (today.getMinutes()<10?'0':'') + today.getMinutes();
    
    bot.sendMessage(chatId, "El precio de la luz a las " + time + " es de " + price + "€ por kWh.");
  });

/**
 * Gets the current spot market price in €/MWh
 * @returns string finalPrice
 */
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
