import { useState, useContext } from "react";
import { Users, Inbox, MessageCircle, MessageCircleMore, Home, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ConnectionsTab } from "../components/messages/ConnectionsTab";
import { ChatsTab } from "../components/messages/ChatsTab";
import { RequestsTab } from "../components/messages/RequestsTab";
import { BlockedTab } from "../components/messages/BlockedTab";
import { LoginContext } from "../context/LoginContextProvider";

export function Messages() {
  const { user, isLogIn } = useContext(LoginContext);
  const [activeTab, setActiveTab] = useState("connections");
  const navigate = useNavigate();

  const tabs = [
    { id: "connections", label: "Subscriptions", icon: Users },
    { id: "requests",    label: "Requests",      icon: Inbox },
    { id: "chats",       label: "Chats",          icon: MessageCircle },
    { id: "blocked",     label: "Blocked",        icon: ShieldOff },
  ];

  return isLogIn ? (
    <div className="min-h-screen p-6 text-white">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-400">Manage your connections and chats</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
              activeTab === id ? "bg-blue-600" : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-zinc-900 rounded-xl p-5 min-h-[500px]">
        {activeTab === "connections" && <ConnectionsTab />}
        {activeTab === "requests"    && <RequestsTab />}
        {activeTab === "chats"       && <ChatsTab />}
        {activeTab === "blocked"     && <BlockedTab />}
      </div>

    </div>
  ) : (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-5 px-4 text-white">
      <MessageCircleMore size={56} className="text-gray-500" />
      <h2 className="text-2xl font-bold text-center">
        Sign in to view your messages
      </h2>
      <p className="text-gray-400 text-center text-sm max-w-xs">
        Log in to send chat requests, view your conversations and messages
      </p>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mt-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-blue-900 transition-colors duration-200 cursor-pointer"
      >
        <Home size={16} />
        Back to Home
      </button>
    </div>
  );
}