export default async function handler(req, res) {
  // वर्सल की तिजोरी (Environment Variable) से टोकन उठाना
  const token = process.env.HF_TOKEN;

  // अगर टोकन तिजोरी में नहीं मिला
  if (!token) {
    return res.status(500).json({ generated_text: "सर्वर की तिजोरी में HF_TOKEN नहीं मिला मास्टर।" });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ generated_text: "सर्वर कनेक्शन में दिक्कत आ रही है मास्टर।" });
  }
}
