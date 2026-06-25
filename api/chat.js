export default async function handler(req, res) {
  const token = process.env.HF_TOKEN;

  if (!token) {
    return res.status(500).json([{ generated_text: "सर्वर की तिजोरी में HF_TOKEN नहीं मिला मास्टर।" }]);
  }

  if (req.method !== 'POST') {
    return res.status(405).json([{ generated_text: "Method Not Allowed" }]);
  }

  try {
    let requestBody = req.body;
    if (typeof requestBody === 'string') {
      requestBody = JSON.parse(requestBody);
    }

    // हमेशा एक्टिव रहने वाला सुपर-फास्ट लामा मॉडल सेट किया
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct", {
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

    if (data.error) {
      return res.status(500).json([{ generated_text: `हगिंग फेस सर्वर एरर: ${data.error}` }]);
    }

    if (Array.isArray(data)) {
      return res.status(200).json(data);
    } else {
      return res.status(200).json([data]);
    }

  } catch (error) {
    return res.status(500).json([{ generated_text: `सर्ver कनेक्शन में दिक्कत आ रही है मास्टर। एरर: ${error.message}` }]);
  }
}
