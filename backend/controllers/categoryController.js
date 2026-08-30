const Category = require("../models/Category");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "eventura/categories");
      imageUrl = result.secure_url;
    }

    const category = new Category({
      categoryName: req.body.categoryName,
      description: req.body.description,
      status: req.body.status,
      image: imageUrl,
    });

    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Read All Categories
exports.getCategory = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read Category By Id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    // Default to whatever value the frontend sent back (the existing
    // secure_url, unchanged) unless a new file was uploaded.
    let imageValue = req.body.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "eventura/categories");
      imageValue = result.secure_url;
    }

    const updatedData = {
      categoryName: req.body.categoryName,
      description: req.body.description,
      status: req.body.status,
      image: imageValue,
    };

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};