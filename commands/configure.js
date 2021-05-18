const { MessageEmbed } = require("discord.js");
const mongo = require("../util/db");

module.exports = {
    slash: true,
    description: 'Configure RavenBot Settings.',
    category: 'Configuration',
    minArgs: 1,
    expectedArgs: '<command> [setting] [value]',
    ownerOnly: true,
    callback: async ({interaction, args }) => {
        const [ command, setting, value ] = args;

        // Ensure only users within the "botowner" variable can use this command.
        const userId = interaction.member.user.id;
        var botOwners = '';
        
        await mongo().then(async (db) => {
            botOwners = (await db.getSetting('botowner')).value;
        });
console.log(command + ' : ' + setting + " : " + value);
        if (command != 'set' && setting != 'botowner') {
            if (botOwners == null || !botOwners || botOwners.length == 0) {
                return '<@' + interaction.member.user.id + '>, no owner has been set!  Please do so with "/configure set botowner <USER_ID>"';
            }
        
            if (botOwners && !botOwners.includes(userId)) {
                return '<@' + interaction.member.user.id + '>, this function is for bot owners only.';
            }

            //return '<@' + interaction.member.user.id + '>, I got lost... please try again.';
        }
console.log('past auth check, getting settings collection.');
        var settings = [];
        await mongo().then(async (db) => {
            await db.getAllSettings()
                .then(async (results) => {
                    await results.forEach((item) => {
                        settings.push(item.name);
                    });
                });
        });
console.log('got settings successfully.');
        switch (command) {
            default:
            case 'help' : {
console.log('entered help handler.');                
                const result = new MessageEmbed();
                result.setColor('C92C2C');
                result.setTitle('RavenBot Configuration');
                result.description = 'RavenBot Commands:';
                result.addField('set | get', 'Sets or gets the value of field.');
                result.addField('Variables', settings);

                // If you want to send it to the user directly rather than in the public chat:
                // var u = await client.users.fetch(interaction.member.user.id);
                // u.send(result);

                // If you want to send it to public chat:
console.log('returning : ' + result);                
                return result;
            }

            case 'set': {
                var result;
                await mongo().then(async(db) => {
                    result = await db.putSetting(setting, value);
                });

                if (result) {
                    result = '<@' + interaction.member.user.id + '>, ' + setting + ' value updated.';
                }
                else {
                    result = '<@' + interaction.member.user.id + '>, Unable to update value for ' + setting + '.';
                }

                return result;
            }

            case 'get': {
                var result;
console.log('get: pre-fetch.');
                await mongo().then(async (db) => {
                    result = await db.getSetting(setting);
                }).then(result => {
                    console.log(result);
                    if  (result) {
                        return '<@' + interaction.member.user.id + '>, ' + setting + ' = ' + result.value;
                    }
                    else {
                        return '<@' + interaction.member.user.id + '>, Setting not found: \"' + setting + '\".\nAvailable settings are: ' + settings;
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }
};