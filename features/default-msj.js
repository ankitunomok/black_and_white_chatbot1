const delay = require('../utils/delay');

module.exports = function (controller) {
	controller.on('hello, welcome_back, message, direct_message', async (bot, message) => {
		await bot.reply(message, { type: 'typing' });
		await bot.changeContext(message.reference);
		await delay(1500);

		await bot.say('Hi there! Welcome to the "Black & White" Sharing Zone!');
		await delay(1500);

		await bot.reply(message, { type: 'typing' });
		await bot.changeContext(message.reference);
		await delay(1500);

		await bot.say('You are just a few steps away from embarking on a journey of food, drinks & sharing.');
		await delay(1500);

		await bot.reply(message, { type: 'typing' });
		await bot.changeContext(message.reference);
		await delay(1500);

		await bot.beginDialog('welcome');
	});
};
