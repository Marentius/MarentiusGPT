const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG,
});

const openai = new OpenAIApi(configuration);

module.exports = async function (context, req) {
    context.log(`Http function processed request for url "${req.url}"`);

    try {
        const { messages } = req.body;

        // API call to OpenAI
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are Marentius' GPT, a helpful assistant for coding." },
                ...messages
            ],
        });

        // Log the response from OpenAI
        const messageContent = completion.data.choices[0].message.content;
        context.log(messageContent);

        // Send the response back to the client
        context.res = {
            body: { message: messageContent }
        };
    } catch (error) {
        context.log("Error during API call:", error);
        context.res = {
            status: 500,
            body: { error: "Error during API call" }
        };
    }
};
