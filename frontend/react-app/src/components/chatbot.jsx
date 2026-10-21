import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

// Crisp SVG Icons
function RobotIcon({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="24" cy="24" r="22" fill="url(#aiBotGrad)" />
      {/* Antenna */}
      <line x1="24" y1="11" x2="24" y2="7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="6" r="2.5" fill="#38bdf8" />
      {/* Earphones */}
      <rect x="7" y="19" width="4" height="9" rx="2" fill="#bfdbfe" />
      <rect x="37" y="19" width="4" height="9" rx="2" fill="#bfdbfe" />
      {/* Head Outer */}
      <rect x="10.5" y="12" width="27" height="23" rx="7" fill="#ffffff" />
      {/* Screen Visor */}
      <rect x="13.5" y="15.5" width="21" height="13" rx="4" fill="#0f172a" />
      {/* Glowing Eyes */}
      <circle cx="19" cy="22" r="2.6" fill="#38bdf8" />
      <circle cx="29" cy="22" r="2.6" fill="#38bdf8" />
      <circle cx="20" cy="21.2" r="0.8" fill="#ffffff" />
      <circle cx="30" cy="21.2" r="0.8" fill="#ffffff" />
      {/* Friendly Smile */}
      <path d="M21.5 25.5Q24 27 26.5 25.5" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
      {/* Neck */}
      <path d="M19 37h10v2a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2z" fill="#94a3b8" />
      <defs>
        <linearGradient id="aiBotGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SendIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}

function RefreshIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
    </svg>
  );
}

function CloseIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function SparklesIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
    </svg>
  );
}

const QUICK_SUGGESTIONS = [
  { label: "🔧 Services", text: "What services are available?" },
  { label: "📅 How to Book?", text: "How do I book a service?" },
  { label: "💰 Pricing Info", text: "What are your service charges?" },
  { label: "📞 Support", text: "How can I contact customer support?" },
];

function getTimeString() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Smart offline fallback responses if Django/Ollama backend is not reachable
function getSmartFallbackReply(userText) {
  const q = userText.toLowerCase().trim();
  const isTamil =
    /[\u0B80-\u0BFF]/.test(userText) ||
    q.includes("vanakkam") ||
    q.includes("eppadi") ||
    q.includes("enna") ||
    q.includes("sevai");

  if (q.includes("plumb") || q.includes("pipe") || q.includes("leak") || q.includes("குழாய்")) {
    return isTamil
      ? "எங்களிடம் தகுதிவாய்ந்த பிளம்பிங் (Plumbing) வல்லுநர்கள் உள்ளனர். கசிவு சரிசெய்தல், புதிய பைப்லைன் அமைத்தல், டேப் பழுது பார்த்தல் போன்ற சேவைகளுக்கு 'Services' பக்கத்தில் முன்பதிவு செய்யலாம்! கட்டணம் ₹199 முதல் தொடங்குகிறது."
      : "We provide expert Plumbing services including leak repair, pipe fitting, tap installation, and drainage clearing starting at ₹199. You can book directly from the Services page!";
  }

  if (q.includes("electric") || q.includes("wiring") || q.includes("fan") || q.includes("light") || q.includes("மின்சாரம்")) {
    return isTamil
      ? "எலக்ட்ரிக்கல் (Electrical) சேவைகளுக்கு அனுபவம் வாய்ந்த எலக்ட்ரீஷியன்கள் தயார்! சுவிட்ச் போர்டு, ஃபேன்/லைட் பழுது மற்றும் புதிய வயரிங் செய்யப்படும். தொடக்கக் கட்டணம் ₹249."
      : "Our certified Electricians handle wiring, switchboard repairs, appliance installations, and power troubleshooting starting from ₹249. Book your slot anytime!";
  }

  if (q.includes("clean") || q.includes("wash") || q.includes("சுத்தம்")) {
    return isTamil
      ? "வீடு ஆழமான சுத்தம் (Deep Cleaning), சமையலறை மற்றும் குளியலறை சுத்தப்படுத்தும் சேவைகள் சிறந்த முறையில் வழங்கப்படும். முன்பதிவு செய்ய 'Services' பக்கத்திற்கு செல்லவும்."
      : "We offer professional Deep Home Cleaning, Kitchen Cleaning, and Bathroom Sanitization services with trusted professionals.";
  }

  if (q.includes("book") || q.includes("order") || q.includes("முன்பதிவு") || q.includes("how")) {
    return isTamil
      ? "முன்பதிவு செய்யும் முறை:\n1. Services பக்கத்திற்கு செல்லவும்.\n2. நீங்கள் விரும்பும் சேவையை தேர்ந்தெடுக்கவும்.\n3. வசதியான தேதி & நேரத்தை தேர்வு செய்யவும்.\n4. 'Book Now' கொடுத்து உறுதி செய்யவும்!"
      : "How to book a service:\n1. Navigate to the 'Services' tab.\n2. Choose the service you need.\n3. Pick your preferred date & time slot.\n4. Click 'Book Now' to confirm!";
  }

  if (q.includes("price") || q.includes("cost") || q.includes("rate") || q.includes("charge") || q.includes("விலை") || q.includes("கட்டணம்")) {
    return isTamil
      ? "எங்கள் சேவைகள் ₹199 முதல் தொடங்குகின்றன! மறைமுக கட்டணங்கள் ஏதுமில்லை (Transparent Pricing). குறிப்பிட்ட சேவையின் முழு கட்டணத்தை அதன் விவரப் பக்கத்தில் காணலாம்."
      : "Our services start affordably from ₹199 with 100% transparent pricing and no hidden costs. Check individual service cards for exact details!";
  }

  if (q.includes("service") || q.includes("available") || q.includes("list") || q.includes("சேவை")) {
    return isTamil
      ? "எங்கள் தளத்தில் கிடைக்கும் முக்கிய சேவைகள்:\n• 🚰 பிளம்பிங் (Plumbing)\n• ⚡ எலக்ட்ரிக்கல் (Electrical)\n• 🧹 வீடு சுத்தம் (Cleaning)\n• 💻 கணினி & லேப்டாப் சர்வீஸ்\n• 🎨 பெயிண்டிங் (Painting)\n• 🪚 தச்சு வேலைகள் (Carpentry)"
      : "Available Services:\n• 🚰 Plumbing & Water Systems\n• ⚡ Electrical Repairs & Installations\n• 🧹 Home Deep Cleaning\n• 💻 Computer & Laptop Service\n• 🎨 Home Painting\n• 🪚 Carpentry & Furniture Assembly";
  }

  if (q.includes("contact") || q.includes("support") || q.includes("phone") || q.includes("help") || q.includes("உதவி")) {
    return isTamil
      ? "உதவிக்கு எங்களை support@smartservices.local அல்லது +91 98765 43210 எண்ணில் தொடர்பு கொள்ளலாம். உங்களுக்கு உதவ நாங்கள் எப்போதும் தயாராக உள்ளோம்!"
      : "Need help? Reach our team at support@smartservices.local or call +91 98765 43210. We're here for you 24/7!";
  }

  if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("வணக்கம்") || q.includes("hai")) {
    return isTamil
      ? "வணக்கம்! நான் SmartServices AI உதவியாளர். உங்களுக்கு பிளம்பிங், எலக்ட்ரிக்கல் அல்லது பிற உள்ளூர் சேவைகளில் என்ன உதவி தேவைப்படுகிறது?"
      : "Hello! 👋 I'm SmartServices AI Assistant. What service can I help you find or book today? (Plumbing, Electrical, Cleaning, Computer Repair, etc.)";
  }

  return isTamil
    ? "உங்கள் செய்திக்கு நன்றி! பிளம்பிங், எலக்ட்ரிக்கல், கிளீனிங் போன்ற எந்தவொரு சேவைக்கும் 'Services' மெனுவில் சென்று உடனடியாக முன்பதிவு செய்யலாம். மேலும் உதவி தேவைப்பட்டால் கேளுங்கள்!"
    : "Thanks for reaching out! You can easily explore and book certified local experts for plumbing, electrical, cleaning, and more directly on our platform. Let me know if you need specific recommendations!";
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "வணக்கம்! 👋 Welcome to SmartServices AI. How can I assist you with local services today?",
      time: getTimeString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSend = async (messageText) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      role: "user",
      text: textToSend,
      time: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error("Backend request returned non-OK status");
      }

      const data = await response.json();
      const reply = data.reply || getSmartFallbackReply(textToSend);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply,
          time: getTimeString(),
        },
      ]);
    } catch (error) {
      console.warn("Backend API unavailable, using intelligent assistant response:", error);
      const fallback = getSmartFallbackReply(textToSend);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: fallback,
          time: getTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "வணக்கம்! 👋 Welcome back to SmartServices AI. How can I assist you with local services today?",
        time: getTimeString(),
      },
    ]);
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-brand">
              <div className="chatbot-header-avatar">
                <RobotIcon size={34} />
                <span className="header-status-badge"></span>
              </div>
              <div className="chatbot-header-text">
                <div className="chatbot-title-row">
                  <h3>SmartServices AI</h3>
                  <span className="ai-pill">
                    <SparklesIcon size={11} /> Smart
                  </span>
                </div>
                <p>
                  <span className="status-dot pulsating"></span>
                  Online Assistant
                </p>
              </div>
            </div>

            <div className="chatbot-header-controls">
              <button
                type="button"
                className="chatbot-control-btn"
                onClick={handleResetChat}
                title="Restart chat"
                aria-label="Restart chat"
              >
                <RefreshIcon size={16} />
              </button>
              <button
                type="button"
                className="chatbot-control-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chatbot"
                aria-label="Close chatbot"
              >
                <CloseIcon size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message-row ${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="chat-avatar-small">
                    <RobotIcon size={22} />
                  </div>
                )}
                <div className={`chat-message ${message.role}`}>
                  <div className="chat-text">{message.text}</div>
                  {message.time && (
                    <div className="chat-time">{message.time}</div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message-row assistant">
                <div className="chat-avatar-small">
                  <RobotIcon size={22} />
                </div>
                <div className="chat-message assistant typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="chatbot-suggestions">
            {QUICK_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                className="suggestion-chip"
                onClick={() => handleSend(sug.text)}
                disabled={loading}
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form className="chatbot-input-form" onSubmit={handleFormSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g., plumbing, electrical)..."
              aria-label="Type your message"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="send-button"
            >
              <SendIcon size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher */}
      <div className="chatbot-launcher">
        {!isOpen && (
          <div
            className="chatbot-tooltip"
            onClick={() => setIsOpen(true)}
            role="button"
            tabIndex={0}
          >
            <SparklesIcon size={13} />
            <span>AI Assistant</span>
          </div>
        )}

        <button
          type="button"
          className={`chatbot-toggle ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close chatbot" : "Open SmartServices AI Assistant"}
        >
          {isOpen ? (
            <span className="toggle-close-icon">
              <CloseIcon size={24} />
            </span>
          ) : (
            <div className="chatbot-toggle-inner">
              <RobotIcon size={38} className="chatbot-main-icon" />
              <span className="chatbot-notification"></span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;