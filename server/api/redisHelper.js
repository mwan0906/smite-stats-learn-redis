const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);

client.FLUSHALL();

const retrieveCache = async (key, promise) => {
    console.log('getting', key);
    const toReturn = await getAsync(key).then( async function(reply) {
        let toReturn;
        if (reply === null) {
            console.log('retrieving...')
            toReturn = await promise;
            client.set(key, JSON.stringify(toReturn));
            toReturn = JSON.parse(JSON.stringify(toReturn));
            return toReturn;
        }
        else {
            console.log('already got!');
            toReturn = JSON.parse(reply);
            return toReturn;
        }
    })
    return toReturn;
}

module.exports = retrieveCache;