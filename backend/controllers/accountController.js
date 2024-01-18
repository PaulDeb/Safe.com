const Account = require('../models/accountModel');

// get account infos
const getAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Account.findOne(
            { _id: id, deletedAt: null },
            '_id admin expert email createdAt lessonInProgress lessonEnded'
        );

        if (!user) {
            return res.status(404).json({ error : "Account not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({ error : err.message });
    }
}

// create new account
const createAccount = async (req, res) => {
    const { pseudo, email, password, expert } = req.body;
    const userExist =  await Account.findOne({ email: email, deletedAt: null });

    if (!!userExist) 
        return res.status(403).send({ message : "Un compte existe déjà avec l'adresse : " + email });

    let newUser = new Account(); 

    // Initialize newUser object with request data 
    newUser.pseudo = pseudo; 
    newUser.email = email;
    newUser.password = password;
    newUser.admin = false;
    newUser.expert = expert;

    // Call setPassword function to hash password 
    newUser.setPassword(password);

    try {
        // Save newUser object to database 
        await newUser.save();
        return res.status(201).send({
            user : {
                id: newUser._id,
                pseudo: newUser.pseudo,
                email: newUser.email,
                admin: newUser.admin,
                expert: newUser.expert,
                lessonEnded: newUser.lessonEnded,
                lessonInProgress: newUser.lessonInProgress
            }
        }); 
    } catch (err) {
        return res.status(400).send({ message : "Failed to add user : " + err.message });

    }
}

// delete a workout
const deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Account.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { deletedAt: Date.now() }
        );
        res.status(200).json({ message: "User deleted !" });
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// update a workout
const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { pseudo, admin, lessonEnded, lessonInProgress, expert } = req.body;

    try {
        const user = await Account.findOneAndUpdate({ _id: id, deletedAt: null }, {
            pseudo: pseudo,
            admin: admin,
            lessonEnded: lessonEnded,
            lessonInProgress: lessonInProgress,
            expert: expert
        });

        res.status(200).json({ message: "User updated !" });
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// update password
const updatePassword = async (req, res) => {
    const { id } = req.params;
    const user = await Account.findOne(
        { _id: id, deletedAt: null }
    );
    const { password, newPassword } = req.body;

    try {
        let passwordIsOk = user.validPassword(password);
        
        if (!passwordIsOk) {
            return res.status(401).json({ message: "Bad Password" });
        }

        user.setPassword(newPassword);
        user.save();
        res.status(200).json({ message: "Password changed !" });
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// test password
const testPassword = async (req, res) => {
    const { id } = req.params;
    const user = await Account.findOne(
        { _id: id, deletedAt: null },
    );
    const { password } = req.body;

    try {
        let passwordIsOk = user.validPassword(password);
        res.status(200).json({ passwordIsOk: passwordIsOk });
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

// test password
const loginAccount = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await Account.findOne(
            { email: email, deletedAt: null },
        );

        if (!user) {
            return res.status(404).json({ error: "Aucun compte lié à cet email n'a été trouvé !" });
        }

        let passwordIsOk = user.validPassword(password);

        if (!passwordIsOk) {
            return res.status(403).json({ error: "Mot de passe incorrect !" });
        }

        res.status(200).json({
            user: {
                id: user._id,
                pseudo: user.pseudo,
                email: user.email,
                admin: user.admin,
                expert: user.expert,
                lessonEnded: user.lessonEnded,
                lessonInProgress: user.lessonInProgress
            }
        });
    } catch (err) {
        res.status(400).json({ error : err.message });
    }
}

module.exports = {
    getAccount,
    createAccount,
    deleteAccount,
    updateAccount,
    updatePassword,
    testPassword,
    loginAccount
};