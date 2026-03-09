const key = "AIzaSyDg1aiZweU9mzZNVP73WQYafShsiAQLUq4";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
}).then(res => res.json()).then(data => {
  if (data.error) {
    console.error("Error:", data.error.message);
  } else {
    console.log("Success! API key works.");
  }
}).catch(console.error);
