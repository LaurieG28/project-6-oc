const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('/sauces', multer, sauceCtrl.getAllSauces);

router.get('/sauces/:id', multer, sauceCtrl.getSauceById);

router.post('/sauces', multer, sauceCtrl.createSauce);

router.put('/sauces/:id', multer, sauceCtrl.updateSauce);

router.delete('/sauces/:id', multer, sauceCtrl.deleteSauce);

router.post('/sauces/:id/like', multer, sauceCtrl.updateSauceReview);

module.exports = router;