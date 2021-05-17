const { MessageEmbed } = require("discord.js");

module.exports = {
    slash: true,
    description: 'Create a new poll.',
    category: 'Utility',
    minArgs: 3,
    expectedArgs: '<question> <option1> <option2> [option3] [option4] [option5]',
    callback: async ({ channel, args }) => {
        const [question, option1, option2, option3, option4, option5] = args;
        const embed = new MessageEmbed();

        var option1Icon = '👍';
        var option2Icon = '👎';
        var option3Icon = '3️⃣';
        var option4Icon = '4️⃣';
        var option5Icon = '5️⃣';

        if (option3 || option4 || option5) {
            option1Icon = '1️⃣';
            option2Icon = '2️⃣';
        }

        var formattedQuestion = question;
        if(formattedQuestion.slice(-1) !== '?') {
            formattedQuestion += '?';
        }

        var field = option1Icon + ' ' + option1 + '\n\n' + option2Icon + ' ' + option2;

        if (option3) {
            field += '\n\n' + option3Icon + ' ' + option3;
        }

        if (option4) {
            field += '\n\n' + option4Icon + ' ' + option4;
        }

        if (option5) {
            field += '\n\n' + option5Icon + ' ' + option5;
        }

        embed.setTitle('📊 ' + formattedQuestion);
        embed.addField(field, '\u200b'); // \u200b is an empty-space value.

        await channel
            .send(embed)
            .then(function(msg) {
                msg.react(option1Icon)
                    .then(() => msg.react(option2Icon))
                    .then(() => {
                        if (option3) { msg.react(option3Icon); }
                    })
                    .then(() => {
                        if (option4) { msg.react(option4Icon); }
                    })
                    .then(() => {
                        if (option5) { msg.react(option5Icon); }
                    });
            })
            .catch(function(ex) {
                console.log(ex);
            });
        
        return 'New Poll';
    }
};