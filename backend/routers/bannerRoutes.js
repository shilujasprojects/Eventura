const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  getBanner,
  updateBanner,
  uploadBannerImage,
  deleteBannerImage,
} = require('../controllers/bannerController');

router.get('/', getBanner);
router.put('/', updateBanner);
router.post('/upload-image', upload.single('image'), uploadBannerImage);
router.delete('/image/:filename', deleteBannerImage);

module.exports = router;