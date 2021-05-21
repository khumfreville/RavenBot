require("discord.js");
const mongo = require("../util/db");

module.exports = {
    slash: true,
    guildOnly: true,
    description: 'Check-in for Roll Call.',
    category: 'Utility',
    minArgs: 0,
    expectedArgs: '[content]',
    callback: async ({ guild, client, interaction, args }) => {
        const [ content ] = args;
        var userName = interaction.member.nick;
        var rollCallCutOffDate = 10;
        var rollCallChannelId = 'rollcall';
        var response = 'Check-Ins are currently closed.  Please check in within the first ' + rollCallCutOffDate + ' days of the month.';
        var checkin = '';

        return await mongo()
            .then(async (db) => {
                try {
                    await db.getSetting(guild, 'rollcallcutoffdate')
                        .then(value => {
                            rollCallCutOffDate = value;
                        });
                    await db.getSetting(guild, 'rollcallchannelid')
                        .then(value => {
                            rollCallChannelId = value;
                        });
                }
                catch (e) {
                    throw e;
                }

                if (content === 'clear') {
                    await client.channels.cache.get(rollCallChannelId).bulkDelete(100)
                        .then(() => {
                            response = 'The roll-call channel has been cleared.'; 
                        });
                }
                else if (new Date().getDate() <= rollCallCutOffDate) {
                    if (userName == null || userName.length == 0) {
                        userName = interaction.member.user.username;
                    }
            
                    checkin = userName + ' checked in';
            
                    if (content) { 
                        checkin += ': ' + content;
                    }

                    response = 'Your attendance has been recorded.';
                }
            }).then(async () => {
                if (checkin !== '') {
                    await client.channels.cache.get(rollCallChannelId).send(checkin);
                }
        
                return response;
            });
    }
};