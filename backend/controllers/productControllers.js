const productModel = require("../models/productModel");
const cloudinary = require("../utiles/cloudinary");

const productControllers = {};

// ✅ Add Product Controller (Supports File Uploads & AI-Generated Image URLs)
productControllers.addProduct = async (req, res) => {
  console.log("\n📥 [POST /products/addProduct] Received product addition request");
  console.log("🔹 Body keys received:", Object.keys(req.body));

  try {
    const {
      name,
      price,
      discount,
      discountPercentage,
      bgcolor = "#ffffff",
      panelcolor = "#f0f0f0",
      textcolor = "#000000",
      details,
      information,
      category,
      brand = "",
      sku = "",
      stock = 50,
      tags,
      keyFeatures,
      warranty = "1 Year Warranty",
      seoTitle = "",
      seoDescription = "",
      imageUrlList,
    } = req.body;

    console.log(`📌 Title: "${name}" | Category: "${category}" | Price: ₹${price} | Brand: "${brand}"`);

    const files = req.files?.images;
    let finalImages = [];

    // Option A: If file buffers are uploaded via Multer
    if (files && files.length > 0) {
      console.log(`🖼️ Uploading ${files.length} image files to Cloudinary...`);
      const uploadPromises = files.map(
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
      finalImages = uploadResults.map((r) => ({
        public_id: r.public_id,
        url: r.secure_url,
      }));
      console.log(`✅ Uploaded ${finalImages.length} images to Cloudinary`);
    }

    // Option B: If image URLs are passed directly (e.g., from AI generator)
    const rawImageList = imageUrlList || req.body.images;
    if (finalImages.length === 0 && rawImageList) {
      console.log("🔗 Parsing AI-generated or direct image URLs list...");
      try {
        let parsedUrls = typeof rawImageList === "string" ? JSON.parse(rawImageList) : rawImageList;
        if (typeof parsedUrls === "string") {
          parsedUrls = [parsedUrls];
        }
        if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
          finalImages = parsedUrls.map((imgItem, idx) => {
            const imgUrl = typeof imgItem === "string" ? imgItem : (imgItem.url || imgItem);
            return {
              public_id: `img_${Date.now()}_${idx}`,
              url: imgUrl,
            };
          });
        }
      } catch (err) {
        console.log("⚠️ Error parsing imageUrlList:", err.message);
      }
    }

    console.log(`🖼️ Total Final Images Array Count: ${finalImages.length}`);

    if (finalImages.length === 0) {
      console.error("❌ Product creation failed: No valid images or image URLs found");
      return res.status(400).json({ message: "At least one image or image URL is required" });
    }

    if (!name || !price) {
      console.error("❌ Product creation failed: Missing Name or Price");
      return res.status(400).json({ message: "Product Name and Price are required" });
    }

    const finalCategory = (category || "electronics").toLowerCase();
    const finalDetails = details || information || name || "Product Overview";
    const finalInformation = information || details || name || "Technical Specifications";

    // Parse array fields if passed as strings
    let parsedTags = tags;
    if (typeof tags === "string") {
      try { parsedTags = JSON.parse(tags); } catch { parsedTags = tags.split(",").map(t => t.trim()); }
    }

    let parsedKeyFeatures = keyFeatures;
    if (typeof keyFeatures === "string") {
      try { parsedKeyFeatures = JSON.parse(keyFeatures); } catch { parsedKeyFeatures = keyFeatures.split("\n").map(f => f.replace(/^•\s*/, "").trim()); }
    }

    const product = new productModel({
      name,
      brand,
      price: Number(price),
      discount: Number(discount) || 0,
      discountPercentage: Number(discountPercentage) || 0,
      bgcolor,
      panelcolor,
      textcolor,
      details: finalDetails,
      information: finalInformation,
      keyFeatures: parsedKeyFeatures || [],
      warranty,
      stock: Number(stock) || 50,
      sku: sku || `SKU-${Date.now()}`,
      tags: parsedTags || [],
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || finalDetails.substring(0, 160),
      category: finalCategory,
      images: finalImages,
    });

    console.log("💾 Saving product document to MongoDB database...");
    await product.save();
    console.log(`🎉 [POST /products/addProduct] SUCCESS! Saved product ID: ${product._id}\n`);

    res.status(201).json({ message: "Product published successfully!", product });
  } catch (error) {
    console.error("❌ [POST /products/addProduct] Error saving product to DB:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Products
productControllers.getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .sort({ createdAt: -1 })
      .lean();
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = productControllers;
