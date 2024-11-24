import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function generateProductKeywords(paragraph) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `Extract the following keywords related to the product or service by their business from the provided paragraph: ${paragraph}. Dont include any explanatory text or additional information outside of JSON.
    Please return **only** a valid JSON object without any extra text, comments, or formatting like code blocks. The result should be in the following JSON structure:
    {
      "keywords": ["keyword1", "keyword2", "keyword3", .... ,"keywordN"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        const cleanText = text.replace(/```json\n|\n```|\\/g, "").trim();

        try {
            const productKeywords = JSON.parse(cleanText);
            if (!Array.isArray(productKeywords.keywords)) {
                throw new Error(`Generated text does not contain a valid 'keywords' array: ${cleanText}`);
            }
            console.log(productKeywords.keywords);
            return productKeywords.keywords; 
        } catch (error) {
            throw new Error(`Error parsing JSON: ${error.message}. Generated text: ${cleanText}`);
        }
    } catch (error) {
        throw new Error(`Error generating content: ${error.message}`);
    }
}

export { generateProductKeywords };