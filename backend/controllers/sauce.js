const Sauce = require('../models/sauce');

exports.getAllSauces = (req, res) => {
    // Renvoie un tableau des sauces de la base de données.
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.getSauceById = (req, res) => {
    // Doit renvoyer la sauce avec l'id fournit
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res) => {
    // Récupère et enregistre l'image dans la BDD et doit afficher le titre l'image etc... de la sauce
    delete req.body._id;
    const sauceToCreate = new Sauce(JSON.parse(req.body.sauce));

    sauceToCreate.likes = 0;
    sauceToCreate.dislikes = 0;
    sauceToCreate.usersLiked = [];
    sauceToCreate.usersDisliked = [];

    if (req.file) {
        sauceToCreate.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    sauceToCreate.save()
        .then(() => res.status(201).json({ message: 'Sauce créée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.updateSauce = (req, res) => {
    // Cherche si la sauce existe déjà et apporte les modifications qu'il faut
    let sauceToUpdate;

    if (req.file) {
        sauceToUpdate = new Sauce(JSON.parse(req.body.sauce));
        sauceToUpdate.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    } else {
        sauceToUpdate = new Sauce(req.body);
    }

    sauceToUpdate._id = req.params.id;

    Sauce.updateOne({ _id: req.params.id }, sauceToUpdate)
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
    // Recherche et trouve la sauce à supprimé et la supprime avec l'id
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.updateSauceReview = (req, res) => {
    // Permet de mettre un avis sur la sauce concernée
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            let updateReview;
            let message;
            let isUserAlreadyLike = sauce.usersLiked.includes(req.body.userId);
            let isUserAlreadyDislike = sauce.usersDisliked.includes(req.body.userId);

            if (!isUserAlreadyLike && req.body.like === 1) {
                updateReview = {
                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId }
                };

                message = 'Like ajouté à la sauce';
            }

            if (isUserAlreadyLike && req.body.like === 0) {
                updateReview = {
                    $inc: { likes: -1 },
                    $pull: { usersLiked: req.body.userId }
                };

                message = 'Like enlevé à la sauce';
            }

            if (!isUserAlreadyDislike && req.body.like === -1) {
                updateReview = {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: req.body.userId }
                };

                message = 'Dislike ajouté à la sauce';
            }

            if (isUserAlreadyDislike && req.body.like === 0) {
                updateReview = {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: req.body.userId }
                };

                message = 'Dislike enlevé à la sauce';
            }

            Sauce.updateOne({ _id: req.params.id }, updateReview)
                .then(() => res.status(200).json({ message }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};
