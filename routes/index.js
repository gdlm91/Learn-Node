const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers')

const storesController = require('../controllers/stores.controller');

// Do work here
router.get('/', storesController.home);
router.get('/add', storesController.add);
router.post('/add', catchErrors(storesController.create));

module.exports = router;
