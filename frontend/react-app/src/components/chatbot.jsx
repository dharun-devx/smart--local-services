import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! 👋 Welcome to SmartServices AI. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: message },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chatbot/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Chatbot request failed.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            data.reply ||
            "Sorry, I couldn't find an answer. Please try again.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            "Unable to connect. Please check whether the backend and Ollama are running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-brand">
              <img
                src="/chatbot-logo.png"
                alt="AI Assistant"
                className="chatbot-header-logo"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              <div>
                <h3>SmartServices AI</h3>
                <p>
                  <span className="status-dot"></span>
                  AI Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant">
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            className="chatbot-input-form"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask anything..."
              aria-label="Type your message"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <div className="chatbot-launcher">
        {!isOpen && (
          <span className="chatbot-tooltip">
            AI Assistant
          </span>
        )}

        <button
          type="button"
          className="chatbot-toggle"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={isOpen ? "Close chatbot" : "Open AI Assistant"}
        >
          {isOpen ? (
            <span className="toggle-close-icon">✕</span>
          ) : (
            <>
              <img
                src="/chatbot-logo.png"
                alt=""
                className="chatbot-launcher-logo"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.nextElementSibling.style.display =
                    "block";
                }}
              />

              <span
                className="chatbot-fallback-icon"
                style={{ display: "none" }}
              >
                🤖
              </span>

              <span className="chatbot-notification"></span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;