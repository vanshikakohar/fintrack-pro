import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { SendHorizonal, Bot, User, Sparkles } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function FinanceAI() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your Finance Assistant. Ask me anything about your expenses, budgets, or investments!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("${API}/financeai", {
        prompt: query,
      });

      const botMsg = {
        sender: "bot",
        text: res.data.reply || "Sorry, I couldn't process that.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const texture = "/mnt/data/A_digital_screenshot_of_a_web_application_named_%22F.png";

  return (
    <div className="flex min-h-screen relative overflow-hidden">

      {/* 🌌 SAME DASHBOARD BACKGROUND */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        {/* base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 10% 10%, rgba(67,56,202,0.12), transparent 12%)," +
              "radial-gradient(900px 500px at 85% 20%, rgba(220, 95, 255, 0.06), transparent 18%)," +
              "linear-gradient(180deg, #03040a 0%, #08030f 60%, #060218 100%)",
          }}
        />

        {/* nebula top-right */}
        <div
          className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(circle at 25% 25%, rgba(124,58,237,0.22), rgba(124,58,237,0.08) 30%, rgba(0,0,0,0) 55%)," +
              "radial-gradient(circle at 70% 60%, rgba(96,165,250,0.12), rgba(99,102,241,0.05) 30%, rgba(0,0,0,0) 55%)",
          }}
        />

        {/* nebula bottom-left */}
        <div
          className="absolute bottom-[-300px] left-[-300px] w-[700px] h-[700px] rounded-full blur-2xl opacity-40"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,99,132,0.07), rgba(255,200,255,0.03) 20%, rgba(0,0,0,0) 60%)",
          }}
        />

        {/* texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${texture}")`,
            backgroundSize: "cover",
            opacity: 0.04,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 relative">
        <Topbar />

        {/* MAIN CONTENT */}
        <main className="relative z-10 p-8 space-y-8 min-h-[calc(100vh-80px)]">

          {/* Header */}
          <div>
            <h1
              className="text-3xl font-extrabold flex items-center gap-3"
              style={{
                background: "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              <Sparkles className="text-purple-300" /> Finance AI
            </h1>

            <p className="text-gray-300 mt-1">
              Ask anything about budgeting, spending, or financial advice.
            </p>
          </div>

          {/* Frosted Glass Chat Container */}
          <div
            className="rounded-2xl p-6 max-w-4xl w-full"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(22px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 30px rgba(0,0,0,0.45)",
            }}
          >
            {/* Messages */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div
                      className="p-3 rounded-xl max-w-[70%] flex items-start gap-2 text-gray-900"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <Bot className="w-4 h-4 mt-1 text-indigo-600" />
                      <p>{msg.text}</p>
                    </div>
                  ) : (
                    <div
                      className="p-3 rounded-xl max-w-[70%] text-white"
                      style={{
                        background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                      }}
                    >
                      <p>{msg.text}</p>
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <div className="text-purple-200 italic">
                  AI is thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
              <input
                type="text"
                placeholder="Ask something about your finances..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg text-white placeholder-gray-300"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-white flex items-center gap-2"
                style={{
                  background: "linear-gradient(90deg,#7c3aed,#3b82f6)",
                  boxShadow: "0 8px 20px rgba(124,58,237,0.4)",
                }}
              >
                <SendHorizonal className="w-4 h-4" /> Send
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import DashboardLayout from "../layouts/DashboardLayout";
// import { SendHorizonal, Bot, User, Sparkles } from "lucide-react";
// import axios from "axios";

// const FinanceAI = () => {
//   const [query, setQuery] = useState("");
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "👋 Hi! I'm your Finance Assistant. Ask me anything about your expenses, budgets, or investments!" },
//   ]);
//   const [loading, setLoading] = useState(false);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     const userMsg = { sender: "user", text: query };
//     setMessages((prev) => [...prev, userMsg]);
//     setQuery("");
//     setLoading(true);

//     try {
//       const res = await axios.post("http://localhost:5000/api/financeai", {
//         prompt: query,
//       });

//       const botMsg = { sender: "bot", text: res.data.reply || "Sorry, I couldn't process that." };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Something went wrong. Please try again later." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="p-6 space-y-6">
//         {/* Search Bar */}
//         <div className="flex justify-between items-center">
//           <input
//             type="text"
//             placeholder="Search transactions..."
//             className="w-1/2 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Title */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Sparkles className="text-blue-600" /> Finance AI
//           </h1>
//           <p className="text-gray-500 mt-1">
//             Get personalized financial insights and advice from your AI assistant
//           </p>
//         </div>

//         {/* Chat Area */}
//         <div className="bg-white rounded-2xl shadow p-6 max-w-4xl">
//           <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`flex items-start gap-3 ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {msg.sender === "bot" && (
//                   <div className="bg-blue-100 text-blue-800 p-3 rounded-xl max-w-[70%] flex items-start gap-2">
//                     <Bot className="w-4 h-4 mt-1" />
//                     <p>{msg.text}</p>
//                   </div>
//                 )}
//                 {msg.sender === "user" && (
//                   <div className="bg-blue-600 text-white p-3 rounded-xl max-w-[70%]">
//                     <p>{msg.text}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//             {loading && (
//               <div className="text-gray-500 italic">AI is thinking...</div>
//             )}
//           </div>

//           {/* Input Box */}
//           <form
//             onSubmit={handleSend}
//             className="flex items-center gap-3 mt-6 border-t pt-4"
//           >
//             <input
//               type="text"
//               placeholder="Ask something about your finances..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//             >
//               <SendHorizonal className="w-4 h-4" /> Send
//             </button>
//           </form>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default FinanceAI;
