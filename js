const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/humanize", async (req, res) => {
  const { text, tone } = req.body;
  const prompt = `Rephrase the following text to sound more natural, like it was written by a human, using a "${tone}" tone:\n\n"${text}"\n\nHumanized version:`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
    });

    res.json({ result: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process text." });
  }
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
