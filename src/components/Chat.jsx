import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import LoadingDots from "./LoadingDots";
import { Section } from "./Interface";
import { profile } from "../data/profile";
import "./chat.css";

const initialMessage = {
  role: "assistant",
  content:
    "I can brief leaders and collaborators on Bharath Ram's partnership value, AI impact, delivery style, work history, and technical depth. Ask for a short overview or go deep on a system, initiative, or leadership scope.",
  toolsUsed: [],
};

async function parseResponsePayload(response) {
  const rawPayload = await response.text();

  if (!rawPayload || !rawPayload.trim()) {
    throw new Error("Empty response from /api/chat. Check the API route and server logs.");
  }

  try {
    return JSON.parse(rawPayload);
  } catch {
    throw new Error(
      "The chat endpoint returned a non-JSON response. Verify /api/chat is available in the current dev server."
    );
  }
}

export const Chat = ({ motionPreset }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const messageListRef = useRef(null);
  const canReset = messages.length > 1 && !loading;

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [loading, messages]);

  async function sendMessage(prompt) {
    const question = prompt.trim();

    if (!question) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: question }];

    setMessages(nextMessages);
    setQuery("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await parseResponsePayload(response);

      if (!response.ok) {
        throw new Error(data.error || "The assistant could not complete the request.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: data.text,
          toolsUsed: data.toolsUsed || [],
        },
      ]);
    } catch (requestError) {
      setError(requestError.message || "The assistant could not complete the request.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(query);
  }

  function handleEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(query);
    }
  }

  function resetConversation() {
    if (!canReset) {
      return;
    }

    setMessages([initialMessage]);
    setQuery("");
    setError("");
  }

  return (
    <Section className="chat-section" motionPreset={motionPreset}>
      <div className="chat-shell">
        <div className="chat-overview">
          <div>
            <p className="profile-eyebrow">AI briefing</p>
            <h2 className="section-heading">Interview the profile with the Responses API</h2>
            <p className="profile-body">
              This assistant is designed for partnership, advisory, and leadership conversations.
              It can answer with a concise executive summary or drill into fit, measurable impact,
              AI initiatives, and contact details using specialized resume-aware tools.
            </p>
          </div>
          <div className="tool-grid">
            {profile.toolset.map((tool) => (
              <div key={tool.name} className="tool-card">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
            ))}
          </div>
          <div className="example-list">
            {profile.chatExamples.map((example) => (
              <button key={example} className="example-chip" onClick={() => sendMessage(example)}>
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-panel">
          <div className="chat-panel__header">
            <div>
              <p className="chat-panel__eyebrow">Conversation</p>
              <p className="chat-panel__meta">Partnership and leadership live briefing</p>
            </div>
            <button
              type="button"
              className="chat-reset"
              disabled={!canReset}
              onClick={resetConversation}
            >
              Reset
            </button>
          </div>
          <div ref={messageListRef} className="message-stream">
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const className = isAssistant
                ? "message-bubble message-bubble--assistant"
                : loading && index === messages.length - 1
                  ? "message-bubble message-bubble--pending"
                  : "message-bubble message-bubble--user";

              return (
                <article key={`message-${index}`} className={className}>
                  <p className="message-bubble__label">{isAssistant ? "AI briefing" : "You"}</p>
                  <div className="markdownanswer">
                    <ReactMarkdown linkTarget="_blank">{message.content}</ReactMarkdown>
                  </div>
                  {isAssistant && message.toolsUsed?.length > 0 && (
                    <div className="tool-pill-row">
                      {message.toolsUsed.map((tool) => (
                        <span key={`${message.content}-${tool}`} className="tool-pill">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
            {loading && (
              <div className="message-loading">
                <LoadingDots color="#f4efe7" />
              </div>
            )}
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <textarea
              disabled={loading}
              onKeyDown={handleEnter}
              rows={2}
              maxLength={800}
              name="userInput"
              placeholder={
                loading
                  ? "Building the answer..."
                  : "Ask about partnership fit, AI impact, work history, or technical depth."
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="textarea"
            />
            <div className="chat-form__footer">
              <p className="chat-form__hint">
                {loading ? "Generating response..." : "Enter to send, Shift+Enter for a new line"}
              </p>
              <div className="chat-form__actions">
                <span className="chat-form__count">{query.length}/800</span>
                <button type="submit" disabled={loading || !query.trim()} className="generatebutton">
                  {loading ? (
                    <div className="loadingwheel">
                      <LoadingDots color="#f4efe7" />
                    </div>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </div>
            </div>
          </form>
          {error && <p className="chat-error">{error}</p>}
        </div>
      </div>
    </Section>
  );
};
