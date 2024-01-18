const express = require('express');
const {
    createAccount,
    getAccount,
    deleteAccount,
    updateAccount,
    updatePassword,
    testPassword,
    loginAccount
} = require('../controllers/accountController');

const router = express.Router();

// GET account
router.get('/:id', getAccount);

// POST a new account
router.post('/register', createAccount);

// DELETE account
router.delete('/:id', deleteAccount);

// UPDATE account
router.patch('/:id', updateAccount);

// UPDATE account password
router.patch('/:id/password', updatePassword);

// test du password
router.post('/:id/password/test', testPassword);

// Connection au compte
router.post('/login', loginAccount);

module.exports = router;