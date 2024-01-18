const express = require('express');
const {
    getModules,
    getModule,
    createModule,
    deleteModule,
    updateModule,
    addLessonToModule,
    removeLessonToModule,
    addRateToModule,
    removeRateToModule
} = require('../controllers/modulesController');

const router = express.Router();

// GET modules
router.get('/', getModules);

// Get module
router.get('/:id', getModule);

// POST a new module
router.post('/', createModule);

// DELETE module
router.delete('/:id', deleteModule);

// UPDATE module
router.patch('/:id', updateModule);

// POST new lesson in module
router.post('/:id/lesson', addLessonToModule);

// DELETE new lesson in module
router.delete('/:id/lesson', removeLessonToModule);

// POST new lesson in module
router.post('/:id/rate', addRateToModule);

// DELETE new lesson in module
router.delete('/:id/rate', removeRateToModule);

module.exports = router;