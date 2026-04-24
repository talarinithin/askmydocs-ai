import { useState, useRef, useEffect } from "react";
import axios from "axios";

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

  // 🔥 GET CURRENT USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/me",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const id = res.data.id;
        setUserId(id);

        // 🔥 USER-SPECIFIC STORAGE KEY
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

        // Reset uploaded file per user
        setUploadedFile("");
      } catch {
        alert("Failed to load user");
      }
    };

    fetchUser();
  }, []);

  // 🔥 SAVE CHATS PER USER
  const saveChats = (updatedChats) => {
    const storageKey = `chats_user_${userId}`;
    setChatHistory(updatedChats);
    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedChats)
    );
  };

  // 🔥 NEW CHAT
  const newChat = (id = userId, existing = chatHistory) => {
    const newChatObj = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    const updated = [newChatObj, ...existing];
    setChatHistory(updated);

    const storageKey = `chats_user_${id}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify(updated)
    );

    setCurrentChatId(newChatObj.id);
    setMessages([]);
  };

  // 🔥 SELECT CHAT
  const selectChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
  };

  // 🔥 SMART SCROLL
  const shouldAutoScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return true;

    return (
      el.scrollHeight - el.scrollTop - el.clientHeight < 100
    );
  };

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    if (shouldAutoScroll()) {
      scrollToBottom();
    }
  }, [messages]);

  // 🔥 UPLOAD PDF
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
          headers: {
            Authorization: "Bearer " + token,
          },
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

  // 🔥 ASK AI
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
          headers: {
            Authorization: "Bearer " + token,
          },
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
                  ? question.slice(0, 20)
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

  // 🔥 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex">

      {/* Sidebar */}
      <div
        className={`bg-white/10 backdrop-blur-xl border-r border-white/10 transition-all duration-500 ${
          sidebarOpen ? "w-80 p-6" : "w-0 p-0 overflow-hidden"
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

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2 block w-full text-sm file:bg-cyan-500 file:text-black file:px-3 file:py-1 file:rounded"
        />

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

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h2>AI Chat 🤖</h2>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-2xl p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-cyan-500 text-black ml-auto"
                  : "bg-white/10"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bg-white/10 p-3 rounded-xl w-fit">
              AI is typing...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAI()}
            placeholder="Ask something..."
            className="flex-1 p-3 rounded-xl bg-white/10 outline-none"
          />

          <button
            onClick={askAI}
            className="bg-cyan-500 text-black px-5 rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}