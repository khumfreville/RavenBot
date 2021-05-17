require("discord.js");
const mongo = require("../util/db");

module.exports = {
    slash: true,
    description: 'Check-in for Roll Call.',
    category: 'Utility',
    minArgs: 0,
    expectedArgs: '[content]',
    callback: async ({ client, interaction, args }) => {
        const [ content ] = args;
        var rollCallCutOffDate = 10;
        var rollCallChannelId = 'rollcall';
        var response = '';
        var checkin = '';

        await mongo().then(async (db) => {
            try {
                rollCallCutOffDate = (await db.getSetting('rollcallcutoffdate')).value;
                rollCallChannelId = (await db.getSetting('rollcallchannelid')).value;
            }
            catch (e) {
                throw e;
            }
            finally {
                //db.close();
            }
                    
            var userName = interaction.member.nick;

            response = 'Check-Ins are currently closed.  Please check in within the first ' + rollCallCutOffDate + ' days of the month.';

            if (content === 'clear') {
                client.channels.cache.get(rollCallChannelId).bulkDelete(100);

                response = 'The roll-call channel has been cleared.';
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
        });

        if (checkin !== '') {
            client.channels.cache.get(rollCallChannelId).send(checkin);
        }

        return response;
    }
};