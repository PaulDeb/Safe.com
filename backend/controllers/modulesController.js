const Modules = require('../models/modulesModel');
const Lessons = require('../models/lessonsModel');
const { default: mongoose } = require('mongoose');

const getModules = async (req, res) => {
/*
    #swagger.tags=['Module']
    #swagger.description= "Get the list of the modules"
    #swagger.responses[200] = {
        schema: [{ $ref: '#/definitions/module' }]
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    try {
        const modules = await Modules.find({ deletedAt: null });

        res.status(200).json(modules);
    } catch (err) {
        return res.status(500).json({ error : err.message });
    }
}

const getModule = async (req, res) => {
/*
    #swagger.tags=['Module']
    #swagger.description= "Get module by id"
    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/module' }
    }
    #swagger.responses[404] = {
        schema: { error: "Module not found" }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/

    const { id } = req.params;

    try {
        const module = await Modules.findOne({ _id: id, deletedAt: null });

        if (!module) {
            return res.status(404).json({ error : "Module not found" });
        }
        res.status(200).json(module);
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

const createModule = async (req, res) => {
/*
    #swagger.tags=['Module']
    #swagger.description= "Create new module"
    #swagger.parameters['body'] = {
        in: 'body',
        description: '',
        required: true,
        schema: { $ref: '#/definitions/newModule' }
    }
    #swagger.responses[201] = {
        schema: { $ref: '#/definitions/module' }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/

    const { name, expert, difficulty } = req.body;

    try {
        const module = await Modules.create({ name, expert, difficulty });
        res.status(201).json(module);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

const deleteModule = async (req, res) => {
    /*
    #swagger.tags=['Module']
    #swagger.description= "Delete a module by id"
    #swagger.responses[200] = {
        schema: { message: "Module deleted !" }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/

    const { id } = req.params;
    try {
        const module = await Modules.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { deletedAt: Date.now() }
        );
        res.status(200).json({ message: "Module deleted !" });
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

const updateModule = async (req, res) => {
/*
    #swagger.tags=['Module']
    #swagger.description= "Update a module by id"
    #swagger.parameters['body'] = {
        in: 'body',
        description: '',
        required: true,
        schema: { $ref: '#/definitions/updateModule' }
    }
    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/module' }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    const { id } = req.params;
    const { name, expert, difficulty } = req.body;

    try {
        const module = await Modules.findOneAndUpdate({ _id: id, deletedAt: null }, {
            name: name,
            expert: expert,
            difficulty: difficulty
        });

        res.status(200).json(module);
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

const addLessonToModule = async (req, res) => {
/*
    #swagger.tags=['Module']
    #swagger.description= "Add a lesson to a module by id"
    #swagger.parameters['body'] = {
        in: 'body',
        description: '',
        required: true,
        schema: { $lessonId: "lessonId" }
    }
    #swagger.responses[200] = {
        schema: { message: "Module updated !" }
    }
    #swagger.responses[400] = {
        schema: { error: "lessonId need to have a value" }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    const { id } = req.params;
    const { lessonId } = req.body;

    if (!lessonId) {
        return res.status(400).json({ error : "lessonId need to have a value" });
    } 

    try {
        const module = await Modules.findOne({ _id: id, deletedAt: null });

        await module.addLesson(lessonId);
        module.save()

        res.status(200).json({ message: "Module updated !" });
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

const removeLessonToModule = async (req, res) => {
/*
    #swagger.tags=['Module']
    #swagger.description= "Remove a lesson from a module by id"
    #swagger.parameters['body'] = {
        in: 'body',
        description: '',
        required: true,
        schema: { $lessonId: "lessonId" }
    }
    #swagger.responses[200] = {
        schema: { message: "Module updated !" }
    }
    #swagger.responses[400] = {
        schema: { error: "lessonId need to have a value" }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/

    const { id } = req.params;
    const { lessonId } = req.body;

    if (!lessonId) {
        return res.status(400).json({ error : "lessonId need to have a value" });
    } 

    try {
        const module = await Modules.findOne({ _id: id, deletedAt: null });

        await module.removeLesson(lessonId);
        module.save()

        res.status(200).json({ message: "Module updated !" });
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

const getLessons = async (req, res) => {
/*
    #swagger.tags=['Module']
    #swagger.description= "Get list of lessons from module"
    #swagger.responses[200] = {
        schema: {
            module: { $ref: '#/definitions/module' },
            lessons: [{ $ref: '#/definitions/lesson' }]
        }
    }
    #swagger.responses[404] = {
        schema: { error: "Module not found" }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    const { id } = req.params;

    try {
        const module = await Modules.findOne({ _id: id, deletedAt: null });

        if (!module) {
            return res.status(404).json({ error : "Module not found" });
        }

        let lessons = await Lessons.find({ _id: {
            $in: module.lessons.map((elem) => (new mongoose.Types.ObjectId(elem)))
        }, deletedAt: null });

        if (!lessons) {
            lessons = [];
        }

        res.status(200).json({
            module,
            lessons
        });
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

module.exports = {
    getModules,
    getModule,
    createModule,
    deleteModule,
    updateModule,
    addLessonToModule,
    removeLessonToModule,
    getLessons
};