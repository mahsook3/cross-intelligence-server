import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function generateProductDetails(paragraph) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `Extract the following product details from the provided paragraph: product name, product details. 
    Please return **only** a valid JSON object without any extra text, comments, or formatting like code blocks. The result should be in the following JSON structure:
    [
    {
        "product_name": "Product name extracted from the paragraph",
        "product_details": "Product details extracted from the paragraph",
    },
    {
        "product_name": "Product name extracted from the paragraph",
        "product_details": "Product details extracted from the paragraph",
    },
    ...
    ]
    Paragraph: ${paragraph}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        const cleanText = text.replace(/```json\n|\n```|\\/g, "").trim();

        if (!cleanText.startsWith("[") || !cleanText.endsWith("]")) {
            throw new Error(`Generated text is not a valid JSON array: ${cleanText}`);
        }

        try {
            const productDetails = JSON.parse(cleanText);
            console.log(productDetails);
            return productDetails;
        } catch (error) {
            throw new Error(`Error parsing JSON: ${error.message}. Generated text: ${cleanText}`);
        }
    } catch (error) {
        throw new Error(`Error generating content: ${error.message}`);
    }
}

export { generateProductDetails };