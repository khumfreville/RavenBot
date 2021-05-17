const { } = require("discord.js");

module.exports = {
    slash: 'both',
    description: 'Some information regarding Fearless-Fighters.',
    category: 'Informational',
    callback: async ({ client, interaction, message }) => {

        var user = await client.api.applications(client.user.id).users(interaction.member.user.id).get();
        console.log(user);
        //var user = client.api.applications(client.user.id).users(interaction.user.id).get();
        console.log('--------------');
        //console.log(user);




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