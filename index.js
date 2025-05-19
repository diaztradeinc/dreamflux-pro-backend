const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MODELSLAB_API_KEY = process.env.MODELSLAB_API_KEY;

app.post('/generate', async (req, res) => {
  const {
    prompt,
    negative_prompt,
    steps,
    sampler,
    cfg,
    seed,
    model
  } = req.body;

  try {
    const response = await axios.post(
      'https://api.modelslab.com/generate',
      {
        prompt,
        negative_prompt,
        steps,
        sampler,
        cfg,
        seed,
        model
      },
      {
        headers: {
          Authorization: `Bearer ${MODELSLAB_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ image_url: response.data.image_url });
  } catch (err) {
    console.error('ModelsLab Error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate image.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});