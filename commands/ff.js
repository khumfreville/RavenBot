const { } = require("discord.js");

module.exports = {
    slash: 'both',
    description: 'Some information regarding Fearless-Fighters.',
    category: 'Informational',
    callback: ({ client, interaction, message }) => {

        var user = client.api.applications(client.user.id);
        console.log(user);
        var user = client.api.applications(client.user.id).users(interaction.user.id).get();
        console.log('--------------');
        console.log(user);




/////

        const response = 
        'Website: https://fearless-fighters.engine.com\n' +
        'Teamspeak: fearless-fighters.engine.com (password: FFMPT)\n';

        if (message) {
            message.reply(response);
        }
        return response;
    }
};