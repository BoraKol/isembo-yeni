const express = require('express');

const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.route('/').post(categoryController.createCategory); // http://localhost:3000/categories
router.route('/:id').delete(categoryController.deleteCategory);
router.route('/:slug').put(categoryController.updateCategory);

module.exports = router;