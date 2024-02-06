const express = require('express');
const {
    getLessons,
    getLesson,
    createLesson,
    deleteLesson,
    updateLesson,
    getRates
} = require('../controllers/lessonsController');

const router = express.Router();

// GET lessons
router.get('/', getLessons);

// Get lesson
router.get('/:id', getLesson);

// Get lesson
router.get('/:id/rates', getRates);

// POST a new lesson
router.post('/', createLesson);

// DELETE lesson
router.delete('/:id', deleteLesson);

// UPDATE lesson
router.patch('/:id', updateLesson);

module.exports = router;