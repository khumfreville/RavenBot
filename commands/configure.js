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
        }).catch(err => {
            console.log(err);
        });

        if (command != 'set' && setting != 'botowner') {
            if (botOwners == null || !botOwners || botOwners.length == 0) {
                return '<@' + interaction.member.user.id + '>, no owner has been set!  Please do so with "/configure set botowner <USER_ID>"';
            }
        
            if (botOwners && !botOwners.includes(userId)) {
                return '<@' + interaction.member.user.id + '>, this function is for bot owners only.';
            }

            //return '<@' + interaction.member.user.id + '>, I got lost... please try again.';
        }

        var settings = [];
        await mongo().then(async (db) => {
            await db.getAllSettings()
                .then(async (results) => {
                    await results.forEach((item) => {
                        settings.push(item.name);
                    });
                });
        }).catch(err => {
            console.log(err);
        });

        switch (command) {
            default:
            case 'help' : {
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
                return result;
            }

            case 'set': {
                var returnValue;
                await mongo().then(async(db) => {
                    await db.putSetting(setting, value);
                }).then(result => {
                    if (result) {
                        returnValue = '<@' + interaction.member.user.id + '>, ' + setting + ' value updated.';
                    }
                    else {
                        returnValue = '<@' + interaction.member.user.id + '>, Unable to update value for ' + setting + '.';
                    }
                }).catch(err => {
                    console.log(err);
                });

                return returnValue;
            }

            case 'get': {
                var returnValue;

                await mongo().then(async (db) => {
                    await db.getSetting(setting);
                }).then(result => {
                    if  (result) {
                        returnValue = '<@' + interaction.member.user.id + '>, ' + setting + ' = ' + result.value;
                    }
                    else {
                        returnValue = '<@' + interaction.member.user.id + '>, Setting not found: \"' + setting + '\".\nAvailable settings are: ' + settings;
                    }
                }).catch(err => {
                    console.log(err);
                });

                return returnValue;
            }
        }
    }
};