const { MessageEmbed } = require("discord.js");
const mongo = require("../util/db");

module.exports = {
    permissions: ['ADMINISTRATOR'],
    guildOnly: true,
    slash: true,
    description: 'Configure RavenBot Settings.',
    category: 'Configuration',
    minArgs: 1,
    expectedArgs: '<command> [setting] [value]',
    ownerOnly: true,
    callback: async ({ guild, interaction, args }) => {
        const [ command, setting, value ] = args;
        var settings = [];

        return await mongo()
            .then(async (db) => {
                await db.getAllSettings(guild.id)
                    .then(async (results) => {
                        await results.forEach((item) => {
                            settings.push(item.name);
                        });
                    });
            }).then(async () => {
                switch (command) {
                    default:
                    case 'help' : {
                        const result = new MessageEmbed({
                            color: 'C92C2C',
                            title: 'RavenBot Configuration',
                            description: 'RavenBot Commands'
                        });
                        
                        result.addField('set | get', 'Sets or gets the value of field.');
                        result.addField('Variables', settings);
    
                        // If you want to send it to the user directly rather than in the public chat:
                        // var u = await client.users.fetch(interaction.member.user.id);
                        // u.send(result);
    
                        // If you want to send it to public chat:        
                        return result;
                    }
    
                    case 'set': {
                        return await mongo().then(async(db) => {
                            return await db.putSetting(guild.id, setting, value);
                        }).then(result => {
                            if (result) {
                                return '<@' + interaction.member.user.id + '>, ' + setting + ' value updated.';
                            }
                            else {
                                return '<@' + interaction.member.user.id + '>, Unable to update value for ' + setting + '.';
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    }
    
                    case 'get': {    
                        return await mongo()
                            .then(async (db) => {
                                return await db.getSetting(guild.id, setting);
                            }).then(result => {
                                if  (result) {
                                    return '<@' + interaction.member.user.id + '>, ' + setting + ' = ' + result.value;
                                }
                                else {
                                    return  '<@' + interaction.member.user.id + '>, Setting not found: \"' + setting + '\".\nAvailable settings are: ' + settings;
                                }
                            }).catch(err => {
                                console.log(err);
                            });
                    }
                }
            }).catch(err => {
                console.log(err);
            });
    }
};