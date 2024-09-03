import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching data from OpenAI:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Support Chat</h1>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role === "user" ? "You" : "Support"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{
          width: "80%",
          padding: "10px",
          marginRight: "10px",
        }}
      />
      <button onClick={handleSendMessage} style={{ padding: "10px 20px" }}>
        Send
      </button>
    </div>
  );
};

export default App;
