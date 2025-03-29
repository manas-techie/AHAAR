const { MongoClient, ObjectId } = require('mongodb');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: "AIzaSyDBeM9tRA4vPBhZD9KO6jgCTBg2roRtB_k" });
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

async function getMenuWithReviews(menuId) {
    try {
        await client.connect();
        const database = client.db("ahaar");
        const menuCollection = database.collection("menus");
        const reviewCollection = database.collection("menureviews");

        const menu = await menuCollection.findOne({ _id: new ObjectId(menuId) });
        if (!menu) {
            throw new Error("Menu not found");
        }

        const reviews = await reviewCollection.find({ _id: { $in: menu.reviews } }).toArray();

        return { menu, reviews };
    } finally {
        await client.close();
    }
}

async function askGemini(menuData, question) {
    if (!menuData) return "Sorry, I couldn't find the menu.";

    const prompt = `
        You are a helpful AI assistant acting like a human assistant. Always give the answer in short. You can also give answer in 5 to 10 words on average.
        If the question is unrelated to the menu, say "I am not sure about that."
        
        Here is the menu information:
        ${JSON.stringify(menuData.menu, null, 2)}
        
        And here are some customer reviews:
        ${JSON.stringify(menuData.reviews, null, 2)}
        
        Based on this, answer: ${question}?
    `;

    const response = await ai.models.generateContent({
        model: "gemini-1.5-pro-latest",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
    });

    return response.candidates[0].content.parts[0].text;
}

module.exports = { getMenuWithReviews, askGemini };
