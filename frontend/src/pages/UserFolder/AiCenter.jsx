import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Bot, Send, Sparkles, User, Apple } from "lucide-react";

const AiCenter = () => {
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "ai",
      text: "Hello! I am your Shop Mart Genius AI assistant. How can I assist you with products, specifications, or orders today?",
    },
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = message;
    const newChat = [...chat, { sender: "user", text: userMessage }];
    setChat(newChat);
    setMessage("");
    setLoader(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ai-help`,
        { code: userMessage },
        { withCredentials: true }
      );

      const aiReply = response.data.text || "Something went wrong. Please try again.";

      setChat([...newChat, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("Error:", error);
      setChat([
        ...newChat,
        { sender: "ai", text: "Something went wrong. Please try again later." },
      ]);
    } finally {
      setLoader(false);
    }
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-24 pb-12 flex-grow flex flex-col">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#0071e3] shadow-sm border border-black/5 mb-2">
            <Sparkles size={14} /> Apple-Engineered AI Guidance
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">
            Shop Mart Genius Bar
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Instant recommendations, gadget support, and order status guidance.
          </p>
        </div>

        {/* Chat Container */}
        <div className="apple-card bg-white flex-grow flex flex-col shadow-xl overflow-hidden min-h-[500px] border border-black/5">
          {/* Chat Messages */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center shrink-0">
                    <Apple size={16} className="fill-current" />
                  </div>
                )}

                <div
                  className={`px-5 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#0071e3] text-white rounded-br-none shadow-md font-medium"
                      : "bg-[#f5f5f7] text-[#1d1d1f] rounded-bl-none border border-black/5"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center shrink-0">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            {loader && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center shrink-0">
                  <Apple size={16} className="fill-current" />
                </div>
                <div className="px-5 py-3 rounded-2xl bg-[#f5f5f7] text-[#86868b] text-sm animate-pulse">
                  Genius AI is thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-6 py-2 bg-[#fbfbfd] border-t border-black/5 flex items-center gap-2 overflow-x-auto text-xs text-[#515154]">
            <span className="font-semibold text-[#86868b] shrink-0">Suggestions:</span>
            <button
              onClick={() => setMessage("Recommend the best headphones under ₹5,000")}
              className="px-3 py-1 bg-white hover:bg-black/5 rounded-full border border-black/5 whitespace-nowrap transition"
            >
              Headphones under ₹5,000
            </button>
            <button
              onClick={() => setMessage("How do I track my active order?")}
              className="px-3 py-1 bg-white hover:bg-black/5 rounded-full border border-black/5 whitespace-nowrap transition"
            >
              Track Active Order
            </button>
            <button
              onClick={() => setMessage("What is the return policy for electronics?")}
              className="px-3 py-1 bg-white hover:bg-black/5 rounded-full border border-black/5 whitespace-nowrap transition"
            >
              Return Policy
            </button>
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-black/5 flex items-center gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="apple-input flex-1 py-3 text-sm"
              type="text"
              placeholder="Ask Genius AI anything about products or orders..."
            />
            <button
              onClick={sendMessage}
              disabled={loader}
              className="apple-btn-primary py-3 px-5 flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 disabled:opacity-50"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AiCenter;

