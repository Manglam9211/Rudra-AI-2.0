export default async function handler(req, res) {
  const token = process.env.HF_TOKEN;

  if (!token) {
    return res.status(500).json({ generated_text: "सर्वर की तिजोरी में HF_TOKEN नहीं मिला मास्टर।" });
  }

  // केवल POST रिक्वेस्ट को अनुमति दें
  if (req.method !== 'POST') {
    return res.status(405).json({ generated_text: "Method Not Allowed" });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token.trim()}`, 
        "Content-Type": "application/json" 
      },
      body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    });

    const data = await response.json();
    
    // अगर हगिंग फेस की तरफ से कोई एरर मैसेज आया हो
    if (data.error) {
      return res.status(500).json({ generated_text: `हगिंग फेस एरर: ${data.error}` });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ generated_text: "सर्वर कनेक्शन में दिक्कत आ रही है मास्टर।" });
  }
}
