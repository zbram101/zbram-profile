import React, { useRef, useState, useEffect } from 'react';
import ChatLayout from './ChatLayout';
import './chat.css';
import ReactMarkdown from 'react-markdown';
import LoadingDots from './LoadingDots';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion';
import { Section } from './Interface';

export const Chat = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageState, setMessageState] = useState({
    messages: [
      {
        message: "Hi, I'm Bharadwaj's assistant. How can I help you?",
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  // handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);

      setLoading(false);

      // scroll to bottom
      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      setError(
        'An error occurred while fetching the data. Please try again.'
      );
      console.log('error', error);
    }
  }

  // prevent empty submissions
  const handleEnter = (e) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <Section>
    <div className="flex flex-col md:flex-row items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tighter text-center">
        Chat With My Assistant!
      </h1>
      <main className="main">
        <div className="cloud">
          <div ref={messageListRef} className="messagelist">
            {messages.map((message, index) => {
              let className;
              if (message.type === 'apiMessage') {
                className = 'apimessage';
              } else {
                // The latest message sent by the user will be animated while waiting for a response
                className =
                  loading && index === messages.length - 1
                    ? 'usermessagewaiting'
                    : 'usermessage';
              }
              return (
                <div key={`chatMessage-${index}`} className={className}>
                  <div className="markdownanswer">
                    <ReactMarkdown linkTarget="_blank">
                      {message.message}
                    </ReactMarkdown>
                  </div>
                  {message.sourceDocs && (
                    <div className="p-5" key={`sourceDocsAccordion-${index}`}>
                      <Accordion
                        type="single"
                        collapsible
                        className="flex-col"
                      >
                        {message.sourceDocs.map((doc, index) => (
                          <div key={`messageSourceDocs-${index}`}>
                            <AccordionItem value={`item-${index}`}>
                              <AccordionTrigger>
                                <h3>Source {index + 1}</h3>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ReactMarkdown linkTarget="_blank">
                                  {doc.pageContent}
                                </ReactMarkdown>
                                <p className="mt-2">
                                  <b>Source:</b> {doc.metadata.source}
                                </p>
                              </AccordionContent>
                            </AccordionItem>
                          </div>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="center">
          <div className="cloudform">
            <form onSubmit={handleSubmit}>
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                id="userInput"
                name="userInput"
                placeholder={
                  loading ? 'Waiting for response...' : 'What would you like to know about Bharadwaj?'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="textarea"
              />
              <button
                type="submit"
                disabled={loading}
                className="generatebutton"
              >
                {loading ? (
                  <div className="loadingwheel">
                    <LoadingDots color="#000" />
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg
                    viewBox="0 0 20 20"
                    className="svgicon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
        {error && (
          <div className="border border-red-400 rounded-md p-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </main>
    </div>
    <footer className="flex flex-col text-center">
      <a>
        Shout out to <a href="https://twitter.com/mayowaoshin">Mayo</a> and <a href="https://www.youtube.com/@WawaSensei">Wawa Sensei </a> for inspiration and guidence.
      </a>
    </footer>
    </Section>

  );
}
