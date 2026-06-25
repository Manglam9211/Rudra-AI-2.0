export default async function handler(req, res) {
  // 1. वर्सल की तिजोरी से फ्रेश टोकन उठाना
  const token = process.env.HF_TOKEN;

  if (!token) {
    return res.status(500).json([{ generated_text: "सर्वर की तिजोरी में HF_TOKEN नहीं मिला मास्टर।" }]);
  }

  // 2. सिर्फ POST रिक्वेस्ट को अनुमति देना
  if (req.method !== 'POST') {
    return res.status(405).json([{ generated_text: "Method Not Allowed" }]);
  }

  try {
    // 3. फ्रंटएंड से आए डेटा (body) को सही से संभालना
    let requestBody = req.body;
    if (typeof requestBody === 'string') {
      requestBody = JSON.parse(requestBody);
    }

    // 4. हगिंग फेस ऑफिशियल API को कॉल करना
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token.trim()}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        inputs: requestBody.inputs,
        parameters: { max_new_tokens: 600, temperature: 0.7 }
      })
    });

    const data = await response.json();

    // 5. अगर हगिंग फेस कोई एरर दे (जैसे मॉडल ओवरलोड या टोकन एरर)
    if (data.error) {
      return res.status(500).json([{ generated_text: `हगिंग फेस सर्वर एरर: ${data.error}` }]);
    }

    // अगर रिस्पॉन्स एरे फॉर्मेट में है
    if (Array.isArray(data)) {
      return res.status(200).json(data);
    } else {
      return res.status(200).json([data]);
    }

  } catch (error) {
    return res.status(500).json([{ generated_text: `सर्वर कनेक्शन में दिक्कत आ रही है मास्टर। एरर: ${error.message}` }]);
  }
}
