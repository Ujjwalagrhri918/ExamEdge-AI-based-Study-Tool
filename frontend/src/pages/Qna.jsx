import React, { useContext, useRef, useEffect, useState } from 'react';
import { UploadContext } from '../context/UploadContext';
import './Qna.css';

const Qna = () => {
  const { selectedFile, URL } = useContext(UploadContext);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

    
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);
  
  

  const fileName = typeof selectedFile === 'string'
    ? selectedFile
    : selectedFile?.name;

  const chatKey = `${fileName}_chats`;


  useEffect(() => {
    const cachedChats = localStorage.getItem(chatKey);
    if (cachedChats) {
      setChatHistory(JSON.parse(cachedChats));
    }
  }, [selectedFile]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { type: 'user', text: question };
    setChatHistory(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch(`${URL}/chat-with-pdf/${fileName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ query: question })
      });

      const data = await response.json();
      const botMessage = {
        type: 'bot',
        text: data?.response || 'No response received.',
        pages_used: data?.pages_used || []
      };

      const updated = [...chatHistory, userMessage, botMessage];
      setChatHistory(updated);
      localStorage.setItem(chatKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Chat API error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedFile) {
    return (
      <div className="qna-chat-container">
        <p className="placeholder">📄 Upload a document to start chatting with it.</p>
      </div>
    );
  }

  return (
    <div className="qna-chat-container">
      <div className="chat-window">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-row ${chat.type === 'user' ? 'user-row' : 'bot-row'}`}
          >
            <div className={`chat-bubble ${chat.type}`}>
              <div className="bubble-text">{chat.text}</div>
              {chat.pages_used && chat.type === 'bot' && (
                <div className="pages-hint">📄 Pages: {chat.pages_used.join(', ')}</div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-row bot-row">
            <div className="chat-bubble bot">
              <div className="bubble-text typing"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading && question.trim()) {
              handleAsk();
            }
          }}
          placeholder="Ask something about the document..."
        />
        <button onClick={handleAsk} disabled={loading || !question.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Qna;
