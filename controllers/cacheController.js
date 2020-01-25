
const crypto = require('crypto');
const CacheData = require('../model/cacheData');

// limit the cache items by changing value of this variable
const CACHE_LIMIT = 10;

function getAllKeysFromCache(req, res) {
    const query = CacheData.find({}).select('key -_id')
    query.exec((err, data) => {
        if (err) {
            res.status(500).send('Error accessing cache');
        } else if (data.length === 0) {
            res.status(204).send("No cached data present");
        } else {
            const keys = data.map(keyData => keyData['key']);
            res.send(keys);
        }
    });
}

function addDataToCache(req, res) {
    CacheData.find({ key: req.body.key }, (err, cacheData) => {
        if (err) {
            res.status(500).send('Error accessing cache');
        } else if (cacheData.length === 0) {
            req.body['expiresOn'] = new Date(new Date().getTime() + 30000);
            const cache = new CacheData(req.body);
            CacheData.count({}, (err, count) => {
                // check if the number of documents are equal to or more than the CACHE_LIMIT
                // if count is less than the CACHE_LIMIT, add the document
                if (count < CACHE_LIMIT) {
                    cache.save()
                        .then( _ => {
                            CACHE_LIMIT += 1;
                            res.status(201).send("Data cached successfully");
                        })
                        .catch(err => {
                            res.status(500).send("Unable to cache data");
                        });
                } 
                /* 
                    else if count is equal to the CACHE_LIMIT, delete the oldest document based on _createdAt
                    timestamp and add the new document
                */
                else {
                    CacheData.deleteOne({}, { sort: { 'created_at' : 1 } }, function(err, _) {
                        if(err) {
                            res.status(500).send('Error accessing cache');
                        }
                        
                        cache.save()
                            .then( _ => {
                                res.status(201).send("Data cached successfully");
                            })
                            .catch(err => {
                                res.status(500).send("Unable to cache data");
                            });
                    });
                }
            });
            
        } else {
            CacheData.updateOne({ key: req.body.key }, { $set : {value: req.body.value }}, (err, _) => {
                if (err) {
                    res.status(500).send('Error accessing cache');
                }
                res.status(201).send("Cache updated successfully");
            });
            
        }
    });
}

function getDataFromCache(req, res) {
    CacheData.find({ key: req.params.key }, (err, cacheData) => {
        if (err) {
            res.status(500).send('Error accessing cache');
        } else if (cacheData.length === 0) {
            console.log('Cache miss');
            const cache = new CacheData({
                key: req.params.key,
                value: crypto.randomBytes(10).toString('hex'),
                expiresOn: new Date(new Date().getTime() + 300000)
            });
            cache.save()
                .then( data => {
                    res.send(data.value);
                })
                .catch(err => {
                    res.status(500).send("Unable to cache data");
                });
        } else {
            console.log("Cache hit");
            if(new Date().getTime() < cacheData[0].expiresOn) {
                CacheData.updateOne({ key: req.params.key }, { $set : { expiresOn: new Date(new Date().getTime() + 300000) }}, (err, _) => {
                    if (err) {
                        res.status(500).send('Error accessing cache');
                    }
                    res.send(cacheData[0].value);
                });
            } else {
                const value = crypto.randomBytes(10).toString('hex');
                const expiresOn = new Date(new Date().getTime() + 300000);
                CacheData.updateOne({ key: req.params.key }, { $set : { value, expiresOn }}, (err,_) => {
                    if (err) {
                        res.status(500).send('Error accessing cache');
                    }
                    res.send(value);
                });                
            }
        }
    });
}

function deleteAllKeysFromCache(req, res) {
    CacheData.remove({}, (err, _) => {
        if(err) {
            res.status(500).send("Error accessing cache");
        }
        res.send("All keys deleted successfully");
    });
}

module.exports = {addDataToCache, getDataFromCache, getAllKeysFromCache, deleteAllKeysFromCache};