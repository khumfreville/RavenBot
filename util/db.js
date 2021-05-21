require('dotenv').config();
const mongoClient = require("mongodb");

module.exports = async () => {
    exports.getSetting = async function getSetting (guild_id, setting) {
        const result = await client.db('RavenBot').collection('settings').findOne(
            { 
                guild: guild_id,
                name: setting 
            });

        return result;
    };

    exports.getAllSettings = async function getAllSettings (guild_id) {
        const result = await client.db('RavenBot').collection('settings').find(
            {
                guild: guild_id 
            });

        return result;
    };

    exports.putSetting = async function putSetting (guild_id, setting, value) {
        const current = await exports.getSetting(guild_id, setting);

        if (current) {
            // Update the existing setting value.
            const updatedSetting = {
                guild: guild_id,
                name: setting,
                value: value
            };

            const result = await client.db('RavenBot').collection('settings').updateOne({
                guild: guild_id, 
                name: setting
            }, { 
                $set: updatedSetting 
            });

            return result;
        }
        else {
            // Create the new value.
            const newSetting = {
                guild: guild_id,
                name: setting,
                value: value
            };

            const result = await client.db('RavenBot').collection('settings').insertOne(newSetting);

            return result;
        }
    };

    const client = await new mongoClient.MongoClient(process.env.MONGODB_URI, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
        });
    await client.connect();

    exports.mongoClient = await client;

    return this;
}