const Category = require("../models/Category");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category({
      categoryName: req.body.categoryName,
      description: req.body.description,
      status: req.body.status,
      image: req.file ? req.file.filename : "",
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
    const categories = await Category.find().sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read Category By Id
// exports.getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);

//     res.status(201).json({
//       success: true,
//       data: category
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

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

    const updatedData = {
      categoryName : req.body.categoryName,
      description : req.body.description,
      status : req.body.status,
      image : req.file? req.file.filename : req.body.image
    }

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