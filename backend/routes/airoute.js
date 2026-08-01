const express = require("express");
const router = express.Router();
const main = require("../services/ai.service.js");
const { generateProductData, groqAiChatSupport } = require("../services/groqProductAi.service.js");

// Groq AI Powered Genius Assistant Route
router.post("/", async (req, res) => {
  const prompt = req.body.code || req.body.prompt;
  if (!prompt) return res.status(400).send("Prompt is required");

  try {
    console.log(`🤖 [Groq Genius AI] User query: "${prompt}"`);
    const aiResponse = await groqAiChatSupport(prompt);
    res.send({ text: aiResponse });
  } catch (error) {
    console.warn("⚠️ [Groq AI Fallback] Switching to secondary AI engine:", error.message);
    try {
      const fallbackResponse = await main(prompt);
      res.send({ text: fallbackResponse });
    } catch (fallbackError) {
      console.error("❌ Both AI engines failed:", fallbackError);
      res.status(500).send({ text: "Sorry, I encountered an issue. Please try again in a moment." });
    }
  }
});

// AI Product Generator Route using Groq AI
router.post("/generate-product", async (req, res) => {
  const { query } = req.body;
  console.log(`\n📩 [AI Route] POST /ai-help/generate-product received query: "${query}"`);

  if (!query) {
    console.log("❌ [AI Route] Missing product query string");
    return res.status(400).json({ message: "Product query is required" });
  }

  try {
    const productData = await generateProductData(query);
    console.log(`✨ [AI Route] Successfully returned AI specs for "${productData.name}"`);
    res.status(200).json({
      success: true,
      message: "Product specifications generated successfully",
      data: productData,
    });
  } catch (error) {
    console.error("❌ [AI Route] Failed to generate AI product data:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate AI product specifications",
    });
  }
});

module.exports = router;
