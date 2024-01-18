const express = require('express');
const {
    getRates,
    getRate,
    createRate,
    deleteRate
} = require('../controllers/ratesController');

const router = express.Router();

// GET modules
router.get('/', getRates);

// Get module
router.get('/:id', getRate);

// POST a new module
router.post('/', createRate);

// DELETE module
router.delete('/:id', deleteRate);

module.exports = router;