const { BotkitConversation } = require('botkit');

const delay = require('../utils/delay');
const axios = require('axios');

module.exports = function (controller) {
	let welcomeConvo = new BotkitConversation('welcome', controller);

	welcomeConvo.addAction('verifyAge');

	welcomeConvo.addQuestion(
		{
			text: 'Please confirm if you are above the legal drinking age',
			quick_replies: [
				{
					title: 'Yes',
					payload: 'Yes',
				},
				{
					title: 'No',
					payload: 'No',
				}
			],
		},
		[
			{
				handler: async (response, convo, bot) => {
					if (response === "No") {
						await bot.say({ type: 'typing' });
						await delay(4000);
						await bot.say('Your Age Not Legal drinking age');

						await bot.say({ type: 'typing' });
						await delay(4000);
						await convo.gotoThread('verifyAge');
					} else {
						await bot.say({ type: 'typing' });
						await delay(4000);
						await convo.gotoThread('name');
					}
				},
			},
		],
		'varAge',
		'verifyAge'
	);

	welcomeConvo.addAction('name');

	welcomeConvo.addQuestion(
		'Enter your name',
		async (response, convo, bot) => {
			await bot.say({ type: 'typing' });
			await delay(4000);
			await convo.gotoThread('askNumber');
		},
		'varName',
		'name'
	);

	welcomeConvo.addAction('askNumber');

	welcomeConvo.addQuestion(
		'Enter your contact number',
		async (response, convo, bot) => {
			if (!/^[1-9]\d{9}$/.test(response)) {
				await bot.say({ type: 'typing' });
				await delay(4000);
				await bot.say('Please apna Sahi phone number de.\n\n e.g.. 9876543210');

				await bot.say({ type: 'typing' });
				await delay(4000);
				await convo.gotoThread('askNumber');
			} else {
				await bot.say({ type: 'typing' });
				await delay(4000);
				await bot.say('Thanks for the details');

				await bot.say({ type: 'typing' });
				await delay(4000);
				await bot.say('Now answer this simple question correctly & stand a chance to win passes to Zomaland,Hyderabad on 21-22 Jan');

				await bot.say({ type: 'typing' });
				await delay(4000);
				await convo.gotoThread('question');
			}
		},
		'varNumber',
		'askNumber'
	);

	welcomeConvo.addAction('question');

	welcomeConvo.addQuestion(
		{
			text: 'Black & White is best enjoyed when',
			quick_replies: [
				{
					title: 'Shared with friends',
					payload: 'Shared with friends',
				},
				{
					title: 'Paired with food',
					payload: 'Paired with food',
				},
				{
					title: 'Made into cocktails',
					payload: 'Made into cocktails',
				},
				{
					title: 'All of them',
					payload: 'All of them',
				},
			],
		},
		[
			{
				handler: async (response, convo, bot) => {
					await bot.say({ type: 'typing' });
					await delay(4000);
					await bot.say("Congratulations! That's correct.");
				},
			},
		],
		'varAns',
		'question'
	);

	welcomeConvo.after(async (results, bot) => {
		if (results.varAge !== 'No') {
			// console.log("verify Age : ", results.varAge);
			// console.log("name : ", results.varName);
			// console.log("number : ", results.varNumber);
			// console.log("code : ", results.varCode);
			// console.log("ans : ", results.varAns);

			var data = JSON.stringify({
				"name": results.varName,
				"contact_number": results.varNumber,
				"legal_drink_age": true,
				"answer": results.varAns
			});

			var config = {
				method: 'post',
				url: 'https://backend.unomok.com/items/black_white_hyderabad',
				headers: {
					'Authorization': 'Bearer apiuser',
					'Content-Type': 'application/json'
				},
				data: data
			};

			axios(config)
				.then(function (response) {
					console.log(JSON.stringify(response.data));
				})
				.catch(function (error) {
					console.log(error);
				});

			// var config = {
			// 	method: 'post',
			// 	url: 'https://backend.unomok.com/items/mcdowell_yaari',
			// 	headers: {
			// 		'Authorization': 'Bearer apiuser',
			// 		'Content-Type': 'application/json',
			// 	},

			// 	data: {
			// 		age: results.varAge,
			// 		name: results.varCity,
			// 		mobile: results.varNumber,
			// 		code: results.varCode,
			// 		answer: results.varAns
			// 	},
			// };

			// axios(config)
			// 	.then(function (response) {
			// 		console.log(response.data);
			// 	})
			// 	.catch(function (error) {
			// 		console.log(error);
			// 	});

			await bot.say({ type: 'typing' });
			await delay(4000);
			await bot.say('Thank you for participating! We will notify you if you are our lucky winner.');
		}
	});

	controller.addDialog(welcomeConvo);
};
