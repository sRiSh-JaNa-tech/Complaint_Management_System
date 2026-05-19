const { GoogleGenerativeAI } = require('@google/generative-ai');

// AI Complaint Analyzer
exports.analyzeComplaint = async (req, res) => {
  const { title, description, category, location } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required for analysis' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'AI service is not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Analyze the following complaint:
      Title: ${title}
      Description: ${description}
      Category: ${category}
      Location: ${location}

      Please provide a JSON response with the following fields:
      - "urgency": (Low, Medium, High, or Critical) - Note: "Electricity issue" should trigger a High priority alert (High or Critical).
      - "department": Suggest the responsible department - Note: "Water leakage" should suggest "Water department", "Garbage complaint" should suggest "Sanitation department".
      - "autoResponse": A polite automatic response message for the user
      - "summary": A brief, AI-generated summary of the complaint text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting from the AI response
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (e) {
      // Fallback if parsing fails
      analysis = {
        urgency: 'Unknown',
        department: 'General Support',
        autoResponse: 'Thank you for your complaint. We have received it and will look into it shortly.',
        summary: 'Unable to generate summary at this time.',
        rawText: text
      };
    }

    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'AI Analysis failed' });
  }
};
