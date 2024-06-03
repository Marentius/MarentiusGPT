// Import dependencies
import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Use environment variables for sensitive data
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, 
    organization: process.env.OPENAI_ORG,
});
const openai = new OpenAIApi(configuration);

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define the directory name from the file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST requests
app.post("/api/gptfunction", async (req, res) => {
    const { messages } = req.body;

    try {
        // API call to OpenAI
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "You are Marentius' GPT, a helpful assistant for coding."},
                ...messages
            ],
        });

        // Log the response from OpenAI
        const messageContent = completion.data.choices[0].message.content;
        console.log(messageContent);

        // Send the response back to the client
        res.json({ message: messageContent });
    } catch (error) {
        console.error("Error during API call:", error);
        res.status(500).json({ error: "Error during API call" });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});