const express = require('express');
const { addDataToCache, getDataFromCache, getAllKeysFromCache, deleteAllKeysFromCache } = require('../controllers/cacheController');

const router = express.Router();

router.get("/keys", getAllKeysFromCache);

router.delete("/keys", deleteAllKeysFromCache);

router.get("/keys/:key", getDataFromCache);

router.post("/", addDataToCache);

module.exports = router;