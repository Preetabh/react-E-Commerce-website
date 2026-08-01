import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  Bot, Send, Sparkles, User, ShoppingBag, GitCompare, 
  PackageCheck, Gift, RefreshCw, Zap, Copy, Check, ChevronRight
} from "lucide-react";

const AiCenter = () => {
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("assistant");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [chat, setChat] = useState([
    {
      sender: "ai",
      text: "Welcome to **Shop Mart Genius AI**! Powered by **Groq Llama 3.3 70B**. Ask me anything about product recommendations, live deals, device comparisons, or order tracking!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loader]);

  async function sendMessage(textToSend) {
    const queryText = textToSend || message;
    if (!queryText.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newChat = [...chat, { sender: "user", text: queryText, time: currentTime }];
    setChat(newChat);
    if (!textToSend) setMessage("");
    setLoader(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ai-help`,
        { code: queryText },
        { withCredentials: true }
      );

      const aiReply = response.data.text || "I am currently unable to process your request. Please try again.";

      setChat([
        ...newChat,
        {
          sender: "ai",
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChat([
        ...newChat,
        {
          sender: "ai",
          text: "Something went wrong while connecting to Groq AI. Please check your connection and try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoader(false);
    }
  }

  const handlePresetClick = (promptText) => {
    setMessage(promptText);
    sendMessage(promptText);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setChat([
      {
        sender: "ai",
        text: "Conversation reset. How can I assist you with your shopping today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Simple Markdown Renderer Helper
  const formatAiMessage = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let formattedLine = line;

      // Bold text formatting
      const parts = formattedLine.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc my-0.5">
            {renderedParts}
          </li>
        );
      } else if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-sm font-black text-slate-900 mt-2 mb-0.5">{line.replace("### ", "")}</h3>;
      } else if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-base font-black text-slate-900 mt-3 mb-1">{line.replace("## ", "")}</h2>;
      } else if (line.trim() === "") {
        return <div key={idx} className="h-1" />;
      } else {
        return <p key={idx} className="my-0.5 leading-relaxed">{renderedParts}</p>;
      }
    });
  };

  return (
    <div className="bg-slate-50 h-screen w-screen overflow-hidden flex flex-col justify-between font-sans selection:bg-amber-200">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 pt-24 sm:pt-26 pb-3 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Compact Header */}
        <div className="text-center mb-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-black text-slate-800 shadow-xs border border-slate-200 mb-1">
            <Zap size={12} className="text-amber-500 fill-amber-400 animate-pulse" />
            <span>GROQ LLAMA 3.3 70B AI ENGINE</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
            Shop Mart Genius AI
          </h1>
        </div>

        {/* 100% Fixed Height Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 w-full overflow-hidden">
          
          {/* Left Column: Feature Modes & Quick Action Cards */}
          <div className="lg:col-span-4 space-y-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0">
            {/* Mode Switcher Buttons */}
            <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-0.5 block">
                Assistant Mode
              </span>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 mt-1">
                <button
                  onClick={() => setActiveTab("assistant")}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all border text-left ${
                    activeTab === "assistant"
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === "assistant" ? "bg-amber-400 text-slate-950" : "bg-white text-slate-800 border border-slate-200"
                  }`}>
                    <ShoppingBag size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-extrabold text-xs">Store Assistant</div>
                    <div className={`text-[9px] truncate ${activeTab === "assistant" ? "text-slate-300" : "text-slate-400"}`}>
                      Product finder &amp; specs
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("compare")}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all border text-left ${
                    activeTab === "compare"
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === "compare" ? "bg-amber-400 text-slate-950" : "bg-white text-slate-800 border border-slate-200"
                  }`}>
                    <GitCompare size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-extrabold text-xs">Device Compare</div>
                    <div className={`text-[9px] truncate ${activeTab === "compare" ? "text-slate-300" : "text-slate-400"}`}>
                      Gadget specs comparison
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all border text-left ${
                    activeTab === "orders"
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === "orders" ? "bg-amber-400 text-slate-950" : "bg-white text-slate-800 border border-slate-200"
                  }`}>
                    <PackageCheck size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-extrabold text-xs">Orders &amp; Refunds</div>
                    <div className={`text-[9px] truncate ${activeTab === "orders" ? "text-slate-300" : "text-slate-400"}`}>
                      Live tracking &amp; policy
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("gift")}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all border text-left ${
                    activeTab === "gift"
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === "gift" ? "bg-amber-400 text-slate-950" : "bg-white text-slate-800 border border-slate-200"
                  }`}>
                    <Gift size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-extrabold text-xs">Smart Gift Advisor</div>
                    <div className={`text-[9px] truncate ${activeTab === "gift" ? "text-slate-300" : "text-slate-400"}`}>
                      Gifts by budget &amp; person
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Action Suggestion Cards */}
            <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
                Suggested Prompts
              </span>

              {activeTab === "assistant" && (
                <>
                  <button
                    onClick={() => handlePresetClick("Recommend top 3 wireless headphones under ₹5,000 with specs")}
                    className="w-full text-left p-2 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/70 hover:border-amber-300 text-xs font-medium transition text-slate-700 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">🎧 Headphones under ₹5,000</span>
                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                  </button>
                  <button
                    onClick={() => handlePresetClick("Show me mechanical keyboards on Shop Mart with offer prices")}
                    className="w-full text-left p-2 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/70 hover:border-amber-300 text-xs font-medium transition text-slate-700 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">⌨️ Mechanical Keyboards</span>
                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                  </button>
                  <button
                    onClick={() => handlePresetClick("What are the best discount offers on laptops today?")}
                    className="w-full text-left p-2 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/70 hover:border-amber-300 text-xs font-medium transition text-slate-700 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">💻 Best Laptop Deals</span>
                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                  </button>
                </>
              )}

              {activeTab === "compare" && (
                <>
                  <button
                    onClick={() => handlePresetClick("Compare iPhone 16 Pro Max vs Samsung Galaxy S24 Ultra")}
                    className="w-full text-left p-2 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/70 hover:border-amber-300 text-xs font-medium transition text-slate-700 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">📱 iPhone 16 Pro vs S24 Ultra</span>
                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                  </button>
                  <button
                    onClick={() => handlePresetClick("Compare Keychron K2 vs Logitech MX Keys for programming")}
                    className="w-full text-left p-2 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/70 hover:border-amber-300 text-xs font-medium transition text-slate-700 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">⌨️ Keychron K2 vs MX Keys</span>
                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                  </button>
                </>
              )}

              {activeTab === "orders" && (
                <>
                  <button
                    onClick={() => handlePresetClick("How do I track my active order?")}
                    className="w-full text-left p-2 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/70 hover:border-amber-300 text-xs font-medium transition text-slate-700 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">📦 Track active order status</span>
                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                  </button>
                  <button
                    onClick={() => handlePresetClick("What is Shop Mart 7-day replacement and refund policy?")}
                    className="w-full text-left p-2 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/70 hover:border-amber-300 text-xs font-medium transition text-slate-700 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">🔄 7-Day Refund Policy</span>
                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                  </button>
                </>
              )}

              {activeTab === "gift" && (
                <>
                  <button
                    onClick={() => handlePresetClick("Suggest birthday gift ideas for a gadget lover under ₹3,000")}
                    className="w-full text-left p-2 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/70 hover:border-amber-300 text-xs font-medium transition text-slate-700 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">🎁 Gadget Gift under ₹3,000</span>
                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: 100% Fixed Height Chat Canvas */}
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col h-full min-h-0 overflow-hidden w-full">
            
            {/* Top Bar */}
            <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
                  <Bot size={18} />
                </div>
                <div>
                  <h2 className="text-xs font-black tracking-wide leading-tight">Genius AI Concierge</h2>
                  <span className="text-[9px] text-amber-400 font-mono block">LIVE • GROQ ENGINE</span>
                </div>
              </div>

              <button
                onClick={clearChat}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-xl border border-slate-700 transition"
                title="Clear Chat"
              >
                <RefreshCw size={12} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Chat Scroll Container with Hidden Scrollbar */}
            <div className="flex-1 p-4 sm:p-5 space-y-3.5 overflow-y-auto bg-slate-50/60 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-0">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs border border-slate-800 mt-0.5">
                      <Bot size={14} />
                    </div>
                  )}

                  <div className="max-w-[88%] sm:max-w-[82%] space-y-0.5">
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                        msg.sender === "user"
                          ? "bg-slate-900 text-white rounded-br-none shadow-md font-medium"
                          : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs"
                      }`}
                    >
                      {formatAiMessage(msg.text)}

                      {/* Copy AI Message Button */}
                      {msg.sender === "ai" && (
                        <button
                          onClick={() => copyToClipboard(msg.text, index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 hover:bg-slate-200 text-slate-600 p-1.5 rounded-lg text-xs"
                          title="Copy message"
                        >
                          {copiedIndex === index ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>

                    <div className={`text-[9px] text-slate-400 font-medium px-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-black mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {loader && (
                <div className="flex gap-2.5 justify-start items-center">
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 border border-slate-800">
                    <Bot size={14} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white text-slate-500 text-xs font-semibold border border-slate-200 shadow-xs flex items-center gap-2">
                    <Zap size={13} className="text-amber-500 animate-spin" />
                    <span>Groq AI is processing your query...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 py-2.5 px-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white transition-all"
                type="text"
                placeholder="Ask Groq Genius AI about products, deals, or order tracking..."
              />
              <button
                onClick={() => sendMessage()}
                disabled={loader}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-1.5 text-xs shadow-md active:scale-95 disabled:opacity-50 transition-all border border-slate-800 shrink-0"
              >
                <Send size={14} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiCenter;
