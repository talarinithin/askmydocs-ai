import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [userId, setUserId] = useState(null);

  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const token = localStorage.getItem("token");

  // GET USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/me", {
          headers: { Authorization: "Bearer " + token },
        });

        const id = res.data.id;
        setUserId(id);

        const storageKey = `chats_user_${id}`;
        const stored =
          JSON.parse(localStorage.getItem(storageKey)) || [];

        setChatHistory(stored);

        if (stored.length > 0) {
          setCurrentChatId(stored[0].id);
          setMessages(stored[0].messages);
        } else {
          newChat(id, stored);
        }

        setUploadedFile("");
      } catch {
        alert("Failed to load user");
      }
    };

    fetchUser();
  }, []);

  const saveChats = (updatedChats) => {
    const storageKey = `chats_user_${userId}`;
    setChatHistory(updatedChats);
    localStorage.setItem(storageKey, JSON.stringify(updatedChats));
  };

  const newChat = (id = userId, existing = chatHistory) => {
    const newChatObj = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    const updated = [newChatObj, ...existing];
    setChatHistory(updated);

    localStorage.setItem(
      `chats_user_${id}`,
      JSON.stringify(updated)
    );

    setCurrentChatId(newChatObj.id);
    setMessages([]);
  };

  const selectChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
  };

  // AUTO SCROLL
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // UPLOAD PDF
  const uploadPDF = async () => {
    if (!file) return alert("Choose PDF first");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setUploadedFile(res.data.filename);
      setFile(null);
      fileInputRef.current.value = "";

      alert("PDF Uploaded ✅");
    } catch {
      alert("Upload Failed ❌");
    }

    setLoading(false);
  };

  // ASK AI
  const askAI = async () => {
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat/ask",
        { question },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      const botMsg = { role: "bot", text: res.data.answer };
      const finalMessages = [...updatedMessages, botMsg];

      setMessages(finalMessages);

      const updatedChats = chatHistory.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: finalMessages,
              title:
                chat.title === "New Chat"
                  ? question.slice(0, 25)
                  : chat.title,
            }
          : chat
      );

      saveChats(updatedChats);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "bot", text: "Error ❌" },
      ]);
    }

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex">

      {/* Sidebar */}
      <div
        className={`bg-white/10 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${
          sidebarOpen
            ? "w-80 p-6"
            : "w-0 p-0 opacity-0 pointer-events-none"
        }`}
      >
        <h1 className="text-xl font-bold mb-4">
          AskMyDocs AI
        </h1>

        <button
          onClick={() => newChat()}
          className="w-full bg-cyan-500 text-black p-2 rounded-xl mb-4"
        >
          + New Chat
        </button>

        <div className="mb-6">
          <p className="text-sm text-zinc-400 mb-2">
            Recent Chats
          </p>

          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              onClick={() => selectChat(chat)}
              className="p-2 rounded-lg hover:bg-white/10 cursor-pointer text-sm"
            >
              {chat.title}
            </div>
          ))}
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-xl text-sm hover:bg-white/20"
          >
            {file ? `📄 ${file.name}` : "Choose PDF"}
          </button>
        </div>

        <button
          onClick={uploadPDF}
          className="w-full bg-cyan-500 text-black p-2 rounded mb-4"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {uploadedFile && (
          <p className="text-green-400 text-sm mb-4">
            Uploaded: {uploadedFile}
          </p>
        )}

        <button
          onClick={logout}
          className="w-full bg-red-500 p-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
          >
            ☰
          </button>
          <h2 className="font-semibold">AI Chat 🤖</h2>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-3xl px-4 py-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black ml-auto"
                  : "bg-white/10 border border-white/10"
              }`}
            >
              {msg.role === "bot" ? (
                <div className="prose prose-invert max-w-none text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.text}</p>
              )}
            </div>
          ))}

          {loading && (
            <div className="bg-white/10 px-4 py-2 rounded-xl w-fit animate-pulse">
              🤖 Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-2 bg-black/30 backdrop-blur-lg">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAI()}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            onClick={askAI}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 px-6 rounded-xl text-black font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}