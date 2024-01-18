const Lessons = require('../models/lessonsModel');

// get all lessons
const getLessons = async (req, res) => {
    try {
        const lessons = await Lessons.find({ deletedAt: null });

        res.status(200).json(lessons);
    } catch (err) {
        return res.status(400).json({ error : err.message });
    }
}

// get lessons by id
const getLesson = async (req, res) => {
    const { id } = req.params;

    try {
        const lesson = await Lessons.findOne({ _id: id, deletedAt: null });

        if (!lesson) {
            return res.status(404).json({ error : "Lesson not found" });
        }
        res.status(200).json(lesson);
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// create new lesson
const createLesson = async (req, res) => {
    const { expert, title, data } = req.body;

    try {
        const lesson = await Lessons.create({ expert, title, data });
        res.status(201).json(lesson);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

// delete a rate
const deleteLesson = async (req, res) => {
    const { id } = req.params;
    try {
        const lesson = await Lessons.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { deletedAt: Date.now() }
        );
        res.status(200).json({ message: "Lesson deleted !" });
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// update a lesson
const updateLesson = async (req, res) => {
    const { id } = req.params;
    const { expert, title, data } = req.body;

    try {
        await Lessons.findOneAndUpdate({ _id: id, deletedAt: null }, {
            expert: expert,
            title: title,
            data: data
        });

        const lesson = await Lessons.findOne({ _id: id, deletedAt: null });

        res.status(200).json(lesson);
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

module.exports = {
    getLessons,
    getLesson,
    createLesson,
    deleteLesson,
    updateLesson
};