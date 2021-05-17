require('dotenv').config();
const mongoClient = require("mongodb");

module.exports = async () => {
    exports.getSetting = async function getSetting (setting) {
        const result = await client.db('RavenBot').collection('settings').findOne({ name: setting });

        return result;
    };

    exports.getAllSettings = async function getAllSettings () {
        const result = await client.db('RavenBot').collection('settings').find();

        return result;
    };

    exports.putSetting = async function putSetting (setting, value) {
        const current = await exports.getSetting(setting);

        if (current) {
            // Update the existing setting value.
            const updatedSetting = {
                name: setting,
                value: value
            };

            const result = await client.db('RavenBot').collection('settings').updateOne({name: setting}, { $set: updatedSetting });

            return result;
        }
        else {
            // Create the new value.
            const newSetting = {
                name: setting,
                value: value
            };

            const result = await client.db('RavenBot').collection('settings').insertOne(newSetting);

            return result;
        }
    };

    const client = await new mongoClient(process.env.MONGO_URI, 
    {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    await client.connect();

    exports.mongoClient = await client;

    return this;
}