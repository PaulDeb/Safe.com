const Rates = require('../models/ratesModel');

const getRates = async (req, res) => {
/*
    #swagger.tags=['Rating']
    #swagger.description= "Get list of all rates"
    #swagger.responses[200] = {
        schema: [{ $ref: '#/definitions/rate' }]
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/

    try {
        const rates = await Rates.find({ deletedAt: null });

        res.status(200).json(rates);
    } catch (err) {
        return res.status(500).json({ error : err.message });
    }
}

const getRate = async (req, res) => {
/*
    #swagger.tags=['Rating']
    #swagger.description= "Get rate by id"
    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/rate' }
    }
    #swagger.responses[404] = {
        schema: { error: "Rate not found" }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    const { id } = req.params;

    try {
        const rate = await Rates.findOne({ _id: id, deletedAt: null });

        if (!rate) {
            return res.status(404).json({ error : "Rate not found" });
        }
        res.status(200).json(rate);
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

const createRate = async (req, res) => {
/*
    #swagger.tags=['Rating']
    #swagger.description= "Create rate"
    #swagger.parameters['body'] = {
        in: 'body',
        description: '',
        required: true,
        schema: { $ref: '#/definitions/newRate' }
    }
    #swagger.responses[201] = {
        schema: { $ref: '#/definitions/rate' }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/

    const { text, rate, creator } = req.body;

    try {
        const newRate = await Rates.create({ text, rate, creator });
        res.status(201).json(newRate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

const deleteRate = async (req, res) => {
/*
    #swagger.tags=['Rating']
    #swagger.description= "Delete rate by id"
    #swagger.responses[200] = {
        schema: { message: "Rate deleted !" }
    }
    #swagger.responses[500] = {
        schema: { error: "message error" }
    }
*/
    const { id } = req.params;
    try {
        const rate = await Rates.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { deletedAt: Date.now() }
        );
        res.status(200).json({ message: "Rate deleted !" });
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

module.exports = {
    getRates,
    getRate,
    createRate,
    deleteRate
};