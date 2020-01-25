const mongoose = require("../db");

const cacheDataSchema = new mongoose.Schema({
    key: String,
    value: String,
    expiresOn: Date
});

const CacheData = mongoose.model("Cache", cacheDataSchema);

module.exports = CacheData;