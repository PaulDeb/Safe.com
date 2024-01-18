const Modules = require('../models/modulesModel');

// get all modules
const getModules = async (req, res) => {
    try {
        const modules = await Modules.find({ deletedAt: null });

        res.status(200).json(modules);
    } catch (err) {
        return res.status(400).json({ error : err.message });
    }
}

// get module by id
const getModule = async (req, res) => {
    const { id } = req.params;

    try {
        const module = await Modules.findOne({ _id: id, deletedAt: null });

        if (!module) {
            return res.status(404).json({ error : "Module not found" });
        }
        res.status(200).json(module);
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// create new module
const createModule = async (req, res) => {
    const { name, expert, difficulty } = req.body;

    try {
        const module = await Modules.create({ name, expert, difficulty });
        res.status(201).json(module);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

// delete a module
const deleteModule = async (req, res) => {
    const { id } = req.params;
    try {
        const module = await Modules.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { deletedAt: Date.now() }
        );
        res.status(200).json({ message: "Module deleted !" });
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// update a module
const updateModule = async (req, res) => {
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
        res.status(400).json({ error : err.message });
    }
}

// add lesson to module
const addLessonToModule = async (req, res) => {
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
        res.status(400).json({ error : err.message });
    }
}

// remove lesson to module
const removeLessonToModule = async (req, res) => {
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
        res.status(400).json({ error : err.message });
    }
}

// add rate to module
const addRateToModule = async (req, res) => {
    const { id } = req.params;
    const { rateId } = req.body;

    if (!rateId) {
        return res.status(400).json({ error : "rateId need to have a value" });
    } 

    try {
        const module = await Modules.findOne({ _id: id, deletedAt: null });

        await module.addRate(rateId);
        module.save()

        res.status(200).json({ message: "Module updated !" });
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// remove rate to module
const removeRateToModule = async (req, res) => {
    const { id } = req.params;
    const { rateId } = req.body;

    if (!rateId) {
        return res.status(400).json({ error : "rateId need to have a value" });
    } 

    try {
        const module = await Modules.findOne({ _id: id, deletedAt: null });

        await module.removeRate(rateId);
        module.save()

        res.status(200).json({ message: "Module updated !" });
    } catch (err) {
        res.status(400).json({ error : err.message });
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
    addRateToModule,
    removeRateToModule
};