const Groq = require("groq-sdk");
const Product = require("../models/productModel");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Guaranteed 100% working high-res product images map
const verifiedImagesMap = {
  keyboard: [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800",
    "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
    "https://images.unsplash.com/photo-1541140532154-b024d715b909?w=800",
  ],
  mouse: [
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
    "https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=800",
  ],
  phone: [
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800",
  ],
  laptop: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
  ],
  headphone: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
    "https://i.ibb.co/N6qJGLBg/wireless-earbuds-with-neon-cyberpunk-style-lighting-2-removebg-preview.png",
  ],
  watch: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
  ],
  camera: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
  ],
  tv: [
    "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800",
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
    "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800",
  ],
  default: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
  ],
};

const generateProductData = async (productQuery) => {
  if (!productQuery || typeof productQuery !== "string") {
    throw new Error("Product name query is required");
  }

  console.log(`\n🤖 [Groq AI] Generating product data & imageKeywords for: "${productQuery}"`);

  const prompt = `You are an AI Product Generator for an e-commerce admin panel.

Generate complete and realistic product data for the given product: "${productQuery}".

Requirements:
- Return ONLY valid JSON.
- Use real-world product information.
- Generate realistic prices in INR (Indian Rupees).
- Discount price must always be lower than the original price.
- Generate an attractive product description.
- Generate detailed technical specifications.
- Generate key features, warranty, stock, SKU, tags, SEO title, and SEO description.

IMPORTANT:
Do NOT generate static image URLs in the AI output.
Instead, return an "imageKeywords" array containing 5 of the best image search queries that can be used with an Image Search API (Google Images, Bing Images, SerpAPI, Pexels API, or Unsplash API).

Required JSON Structure:
{
  "name": "Full official product title with model and color/variant (string)",
  "brand": "Brand name e.g. Apple, Samsung, Sony, Logitech, Keychron (string)",
  "category": "Matching category e.g. Mobile, Laptops, Headphones, Electronics, Keyboards (string)",
  "price": 149900,
  "discount": 139900,
  "discountPercentage": 7,
  "details": "Compelling 2-3 sentence overview highlighting craftsmanship and flagship performance. (string)",
  "information": "Bullet points listing key technical specs like Processor, Display, Battery, Storage, OS, Build. (string)",
  "keyFeatures": [
    "Feature 1 highlight",
    "Feature 2 highlight",
    "Feature 3 highlight",
    "Feature 4 highlight"
  ],
  "warranty": "Official warranty description e.g. 1 Year Official Brand Warranty (string)",
  "stock": 35,
  "sku": "Unique product SKU string e.g. APL-IP16PM-256-BLK",
  "tags": ["iphone", "apple", "5g", "smartphone"],
  "seoTitle": "SEO title e.g. Buy Apple iPhone 16 Pro Max 256GB Black Titanium Online (string)",
  "seoDescription": "Compelling 150-character meta description for search engines. (string)",
  "imageKeywords": [
    "${productQuery} front view official photo",
    "${productQuery} product image",
    "${productQuery} back view",
    "${productQuery} side angle shot",
    "${productQuery} studio product photo"
  ]
}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You output strictly raw valid JSON. Do not include markdown tags like ```json.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });

    let rawText = chatCompletion.choices[0]?.message?.content || "";
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    let productJson;
    try {
      productJson = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("❌ [Groq AI] JSON parse failed for raw response text:", rawText);
      throw new Error("Failed to parse AI response into structured JSON");
    }

    // Ensure imageKeywords is an array
    if (!Array.isArray(productJson.imageKeywords) || productJson.imageKeywords.length === 0) {
      productJson.imageKeywords = [
        `${productQuery} front view`,
        `${productQuery} official product image`,
        `${productQuery} back view`,
        `${productQuery} side view`,
        `${productQuery} studio product photo`,
      ];
    }

    // Match image category for high-resolution gallery URLs based on keywords
    const queryLower = (productQuery + " " + (productJson.name || "") + " " + (productJson.category || "")).toLowerCase();
    let selectedImages = verifiedImagesMap.default;

    if (queryLower.includes("keyboard") || queryLower.includes("keychron") || queryLower.includes("logitech mx") || queryLower.includes("mechanical") || queryLower.includes("keycap")) {
      selectedImages = verifiedImagesMap.keyboard;
    } else if (queryLower.includes("mouse") || queryLower.includes("trackpad") || queryLower.includes("logitech g")) {
      selectedImages = verifiedImagesMap.mouse;
    } else if (queryLower.includes("phone") || queryLower.includes("iphone") || queryLower.includes("galaxy") || queryLower.includes("pixel") || queryLower.includes("mobile") || queryLower.includes("electronics")) {
      selectedImages = verifiedImagesMap.phone;
    } else if (queryLower.includes("macbook") || queryLower.includes("laptop") || queryLower.includes("dell") || queryLower.includes("thinkpad")) {
      selectedImages = verifiedImagesMap.laptop;
    } else if (queryLower.includes("headphone") || queryLower.includes("earbuds") || queryLower.includes("sony wh") || queryLower.includes("airpods") || queryLower.includes("audio")) {
      selectedImages = verifiedImagesMap.headphone;
    } else if (queryLower.includes("watch") || queryLower.includes("smartwatch") || queryLower.includes("apple watch")) {
      selectedImages = verifiedImagesMap.watch;
    } else if (queryLower.includes("camera") || queryLower.includes("canon") || queryLower.includes("sony a")) {
      selectedImages = verifiedImagesMap.camera;
    } else if (queryLower.includes("tv") || queryLower.includes("oled") || queryLower.includes("qled") || queryLower.includes("monitor")) {
      selectedImages = verifiedImagesMap.tv;
    }

    // Attach both imageKeywords AND resolved verified gallery URLs for immediate display
    productJson.images = selectedImages;

    if (productJson.price && productJson.discount && !productJson.discountPercentage) {
      productJson.discountPercentage = Math.round(
        ((productJson.price - productJson.discount) / productJson.price) * 100
      );
    }

    console.log(`✅ [Groq AI] Generated JSON for: "${productJson.name}" | imageKeywords count: ${productJson.imageKeywords.length}`);

    return productJson;
  } catch (error) {
    console.error("❌ [Groq AI] Service Error:", error.message);
    throw error;
  }
};

// Groq AI Powered Shop Mart Genius Assistant
const groqAiChatSupport = async (userPrompt) => {
  try {
    let catalogContext = "";
    try {
      const liveProducts = await Product.find({}).limit(25).select("name brand price discount category rating details keyFeatures");
      catalogContext = liveProducts.map(p => 
        `- ${p.name} | Category: ${p.category} | Price: ₹${p.price} (Offer Price: ₹${p.discount || p.price}) | Rating: ${p.rating || 4.8}★ | Specs: ${p.details || ''}`
      ).join("\n");
    } catch (dbErr) {
      console.warn("⚠️ [Groq AI Chat] Product context fetch fallback:", dbErr.message);
    }

    const systemPrompt = `You are Shop Mart Genius AI — the ultra-intelligent, friendly, and helpful AI Shopping Assistant for "Shop Mart Luxury Mall" (founded by Store Owner Mr. Vishu Awasthi).

Your core capabilities and features:
1. 🛍️ **PRODUCT RECOMMENDATIONS & COMPARISON**: Recommend exact products from our Shop Mart store inventory, compare gadgets/clothes/laptops side-by-side with specs and best prices.
2. 📦 **ORDER & SHIPPING SUPPORT**: Help users track active orders, explain 7-day hassle-free replacement & refund policy, and express 2-day delivery.
3. 💰 **COINS & REWARDS**: Explain Shop Mart Coins, wallet cashback, discount coupons, and VIP Identity Pass benefits.
4. 💡 **GIFT FINDER & TECH ADVICE**: Provide smart gift recommendations based on budget and recipient.
5. 🌐 **SUPPORT LANGUAGE**: Respond fluently in English or Hinglish based on the user's input.

REAL-TIME SHOP MART STORE INVENTORY:
${catalogContext.length > 0 ? catalogContext : "Featured: iPhones, MacBooks, Sony Headphones, Keychron Mechanical Keyboards, Smartwatches, Luxury Apparel."}

STORE CONTACT & EMERGENCY SUPPORT:
- Store Owner: Mr. Vishu Awasthi
- Email: vishubbkup@gmail.com
- Phone (Critical payment/login issues only): 9452900378

Formatting: Use markdown bullets, bold headings, price symbols (₹), and concise, warm responses.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "I am currently unable to process your request. Please try again.";
  } catch (error) {
    console.error("❌ [Groq AI Chat] Error:", error.message);
    throw error;
  }
};

module.exports = { generateProductData, groqAiChatSupport };
