const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers')

const storesController = require('../controllers/stores.controller');

// Do work here
router.get('/', catchErrors(storesController.getStores));
router.get('/stores', catchErrors(storesController.getStores));
router.get('/add', storesController.add);
router.post('/save',
    storesController.upload,
    catchErrors(storesController.resize),
    catchErrors(storesController.create)
);
router.get('/stores/:id/edit', catchErrors(storesController.edit));
router.post('/save/:id',
    storesController.upload,
    catchErrors(storesController.resize),
    catchErrors(storesController.update)
);
router.get('/stores/:slug', catchErrors(storesController.getStoreBySlug));

module.exports = router;
