const { } = require("discord.js");

module.exports = {
    slash: 'both',
    description: 'Some information regarding Fearless-Fighters.',
    category: 'Informational',
    callback: ({ message }) => {
        const response = 
        'Website: https://fearless-fighters.engine.com\n' +
        'Teamspeak: fearless-fighters.engine.com (password: FFMPT)\n';

        if (message) {
            message.reply(response);
        }
        return response;
    }
};