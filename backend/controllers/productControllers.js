const productModel = require("../models/productModel");
const cloudinary = require("../utiles/cloudinary");

const productControllers = {};

// ✅ Add Product Controller
productControllers.addProduct = async (req, res) => {
  try {
    const { name, price, discount, bgcolor, panelcolor, textcolor, details,information, category  } =
      req.body;

    // Support multer.fields (req.files)
    const images = req.files?.images;


    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    if (
      !name ||
      !price ||
      !discount ||
      !bgcolor ||
      !panelcolor ||
      !textcolor ||
      !category ||
      !information ||
      !details
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const categoryLower = category.toLowerCase();

    // ✅ Upload multiple images to Cloudinary
    const uploadPromises = images.map(
      (image) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(image.buffer);
        })
    );

    const uploadResults = await Promise.all(uploadPromises);

    // ✅ Save Product to Database
    const product = new productModel({
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      information,
      details,
      category:categoryLower,
      images: uploadResults.map((result) => ({
        public_id: result.public_id,
        url: result.secure_url,
      })),
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
     if (error.code === "ENOTFOUND") {
        console.log("⚠️ Please check your Internet connection or DNS settings!");
    }
    res.status(500).json({ error: error.message });

  }
};

// ✅ Get All Products

productControllers.getAllProducts = async (req, res) => {
  try {

    const products = await productModel
      .find()
      .sort({ createdAt: -1 }) // DB level reverse
      .lean(); // removes mongoose overhead

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Product By ID
productControllers.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Product
productControllers.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Suggested Product
productControllers.suggestedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const category = product.category;

    const suggestedProduct = await productModel.find({ category, _id: { $ne: id } }).limit(4);

    res.status(200).json(suggestedProduct);
  }

    catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = productControllers; // ✅ Export controllers correctly
