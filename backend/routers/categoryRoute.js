const express = require('express');
const router = express.Router();
const controllers = require('../controllers/categoryController');
const upload = require('../middlewares/upload')

router.post('/create-category', upload.single('image'), controllers.createCategory);
router.get('/', controllers.getCategory);
router.get('/view-category/:id',upload.single('image'), controllers.getCategoryById);
router.put('/edit-category/:id', upload.single('image'), controllers.updateCategory);
router.delete('/:id', controllers.deleteCategory);

module.exports = router;