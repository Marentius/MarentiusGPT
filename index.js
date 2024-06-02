// Import dependencies
import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Instance of OpenAI API client
const openai = new OpenAI({
    apiKey: "", 
    organization: "", 
});

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
app.post("/", async (req, res) => {
    const { messages } = req.body;

    try {
        // API call to OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "You are Marentius' GPT, a helpful assistant for coding."},
                ...messages
            ],
        });

        // Log the response from OpenAI
        const messageContent = completion.choices[0].message.content;
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