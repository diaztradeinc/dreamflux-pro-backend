const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

require("dotenv").config();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/generate", async (req, res) => {
  const body = req.body;
  const apiKey = process.env.MODELSLAB_API_KEY;

  try {
    const response = await axios.post("https://api.modelslab.dev/v6/realtime/text2img", {
      key: apiKey,
      model: body.model,
      prompt: body.prompt,
      negative_prompt: body.negative_prompt,
      steps: body.steps,
      sampler: body.sampler,
      cfg_scale: body.cfg,
      seed: body.seed || null,
      restore_faces: body.restore_faces || false,
      hires_fix: body.hires_fix || false,
      image: body.image || null
    });

    if (response.data && response.data.output && response.data.output[0]) {
      res.status(200).json({ image_url: response.data.output[0] });
    } else {
      res.status(500).json({ error: "No image returned from ModelsLab", raw: response.data });
    }
  } catch (err) {
    console.error("ModelsLab Error:", err.message || err);
    res.status(500).json({ error: "Failed to call ModelsLab", detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});