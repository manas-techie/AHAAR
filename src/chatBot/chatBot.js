const { MongoClient, ObjectId } = require('mongodb');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: "AIzaSyBXOV88hOKUR2qCyKTU9LMz0BefeUGC-HU" });
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

async function getMenuWithReviews(menuId) {
    try {
        await client.connect();
        const database = client.db("ahaar");
        const menuCollection = database.collection("menus");
        const reviewCollection = database.collection("menureviews");

        const menu = await menuCollection.findOne({ _id: menuId });
        //  console.log(menu)
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
        You are a helpful AI assistant for AHAAR.
        
        - If the conversation starts with "Hi" or "Hello," say: "Hello! I am AHAAR's assistant. How can I help you today?"  
        - If the question is completly unrelated to the menu, say: "I am not sure about that." other wise try to answer the question using the review and menu data and you knowdege from internate.  
        - Keep answers short (5 to 10 words).  
        - If asked for menu recommendations, suggest items based on customer reviews.  
        - If asked why an item is recommended, refer to customer reviews.  
        - If no reviews are available, say: "This item is popular among customers."  
        
        Here is the menu information:
        ${JSON.stringify(menuData.menu, null, 2)}
        
        And here are some customer reviews:
        ${JSON.stringify(menuData.reviews, null, 2)}
        
        Based on this, answer: ${question}?
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
    });

    return response.candidates[0].content.parts[0].text;
}

module.exports = { getMenuWithReviews, askGemini };
