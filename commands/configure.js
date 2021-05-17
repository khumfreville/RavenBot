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
console.log('running configure');
        // Ensure only users within the "botowner" variable can use this command.
        const userId = interaction.member.user.id;
        var botOwners = '';
        
        await mongo().then(async (db) => {
            botOwners = (await db.getSetting('botowner')).value;
        });
        
        if (command != 'set' && setting != 'botowner') {
            if (botOwners == null || !botOwners || botOwners.length == 0) {
                return '<@' + interaction.member.user.id + '>, no owner has been set!  Please do so with "/configure set botowner <USER_ID>"';
            }
        
            if (botOwners && !botOwners.includes(userId)) {
            return '<@' + interaction.member.user.id + '>, this function is for bot owners only.';
            }
        }

        var settings = [];
        await mongo().then(async (db) => {
            const results = await db.getAllSettings();

            await results.forEach((item) => {
                settings.push(item.name);
            });
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

                await mongo().then(async (db) => {
                    result = await db.getSetting(setting);
                });
                console.log(setting + ' : ' + result);
                if  (result) {
                    return '<@' + interaction.member.user.id + '>, ' + setting + ' = ' + result.value;
                }
                else {
                    return '<@' + interaction.member.user.id + '>, Setting not found: \"' + setting + '\".\nAvailable settings are: ' + settings;
                }
            }
        }
    }
};