const Lessons = require('../models/lessonsModel');
const Modules = require('../models/modulesModel');
const Rates = require('../models/ratesModel');
const Accounts = require('../models/accountModel');
const { default: mongoose } = require('mongoose');

const getLessons = async (req, res) => {
/*
    #swagger.tags=['Lesson']
    #swagger.description= "Get list of all lessons"
    #swagger.responses[200] = {
        schema: [{ $ref: '#/definitions/lesson' }]
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    try {
        const lessons = await Lessons.find({ deletedAt: null });

        res.status(200).json(lessons);
    } catch (err) {
        return res.status(500).json({ error : err.message });
    }
}

const getLesson = async (req, res) => {
/*
    #swagger.tags=['Lesson']
    #swagger.description= "Get lesson by id",
    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/lesson' }
    }
    #swagger.responses[404] = {
        schema: { error: "Lesson not found" }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    const { id } = req.params;

    try {
        const lesson = await Lessons.findOne({ _id: id, deletedAt: null });

        if (!lesson) {
            return res.status(404).json({ error : "Lesson not found" });
        }
        res.status(200).json(lesson);
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

const createLesson = async (req, res) => {
/*
    #swagger.tags=['Lesson']
    #swagger.description= "Create a lesson"
    #swagger.parameters['body'] = {
        in: 'body',
        description: '',
        required: true,
        schema: { $ref: '#/definitions/newLesson' }
    }
    #swagger.responses[201] = {
        schema: { $ref: '#/definitions/lesson' }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    const { expert, title, data } = req.body;

    try {
        const lesson = await Lessons.create({ expert, title, data });
        res.status(201).json(lesson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

const deleteLesson = async (req, res) => {
/*
    #swagger.tags=['Lesson']
    #swagger.description= "Delete a lesson by id and remove it from lesson"
    #swagger.responses[200] = {
        schema: { message: "Lesson deleted !" }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    const { id } = req.params;
    try {
        const lesson = await Lessons.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { deletedAt: Date.now() }
        );

        const module = await Modules.findOne({ 'lessons': {
            $in: id
        }});

        let index = module.lessons.indexOf(id);

        if(index !== -1) {
            module.lessons.splice(index, 1);
            module.save();
        }

        res.status(200).json({ message: "Lesson deleted !" });
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

const updateLesson = async (req, res) => {
/*
    #swagger.tags=['Lesson']
    #swagger.description= "Update a lesson by id"
    #swagger.parameters['body'] = {
        in: 'body',
        description: '',
        required: true,
        schema: { $ref: '#/definitions/updateLesson' }
    }
    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/lesson' }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
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
        res.status(500).json({ error : err.message });
    }
}

const getRates = async (req, res) => {
/*
    #swagger.tags=['Lesson']
    #swagger.description= "Return all the rates objects of the lesson"
    #swagger.responses[200] = {
        schema: [{ $ref: '#/definitions/rate' }]
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    const { id } = req.params;

    try {
        const lesson = await Lessons.findOne({ _id: id, deletedAt: null });
        
        if (!lesson) {
            return res.status(404).json("Lesson not found !");
        }

        const rates = await Rates.find({ _id: {
            $in: lesson.rates.map((elem) => (new mongoose.Types.ObjectId(elem)))
        }, deletedAt: null });


        let ratesWithAccount = [];

        for (let rate of rates) {
            const creator = await Accounts.findOne({ _id: rate.creator });
            ratesWithAccount.push({
                _id: rate._id,
                rate: rate.rate,
                text: rate.text,
                createdAt: rate.createdAt,
                updatedAt: rate.updatedAt,
                creator: {
                    pseudo: creator.pseudo,
                    expert: creator.expert
                }
            });
        }

        res.status(200).json(ratesWithAccount);
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

module.exports = {
    getLessons,
    getLesson,
    createLesson,
    deleteLesson,
    updateLesson,
    getRates
};