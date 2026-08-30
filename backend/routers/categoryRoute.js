const express = require('express');
const router = express.Router();
const controllers = require('../controllers/categoryController');
const upload = require('../middlewares/cloudinaryUpload');

router.post('/create-category', upload.single('image'), controllers.createCategory);
router.get('/', controllers.getCategory);
router.get('/view-category/:id', controllers.getCategoryById); // removed upload middleware
router.put('/edit-category/:id', upload.single('image'), controllers.updateCategory);
router.delete('/:id', controllers.deleteCategory);

module.exports = router;