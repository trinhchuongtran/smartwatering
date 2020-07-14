var MongoClient = require('mongodb').MongoClient;

const url = "mongodb://PentaT:PentaT@52.237.77.5:27017/PentaT";
module.exports = {
    db: async function db(){
        var dbo = await MongoClient.connect(url, { useUnifiedTopology: true });
        return await dbo.db('PentaT');
    }
};