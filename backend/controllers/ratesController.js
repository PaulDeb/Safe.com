const Rates = require('../models/ratesModel');

// get all rates
const getRates = async (req, res) => {
    try {
        const rates = await Rates.find({ deletedAt: null });

        res.status(200).json(rates);
    } catch (err) {
        return res.status(400).json({ error : err.message });
    }
}

// get rate by id
const getRate = async (req, res) => {
    const { id } = req.params;

    try {
        const rate = await Rates.findOne({ _id: id, deletedAt: null });

        if (!rate) {
            return res.status(404).json({ error : "Rate not found" });
        }
        res.status(200).json(rate);
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// create new rate
const createRate = async (req, res) => {
    const { text, rate, creator } = req.body;

    try {
        const newRate = await Rates.create({ text, rate, creator });
        res.status(201).json(newRate);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

// delete a rate
const deleteRate = async (req, res) => {
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