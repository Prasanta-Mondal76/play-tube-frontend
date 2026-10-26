import { useState, useContext } from "react";
import { Users, Inbox, MessageCircle, MessageCircleMore, Home, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ConnectionsTab } from "../components/messages/ConnectionsTab.jsx";
import { ChatsTab } from "../components/messages/ChatsTab.jsx";
import { RequestsTab } from "../components/messages/RequestsTab.jsx";
import { BlockedTab } from "../components/messages/BlockedTab.jsx";
import { LoginContext } from "../context/LoginContextProvider.jsx";

export function Messenger() {
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
    <div className="h-[calc(100dvh-4rem)] flex flex-col overflow-hidden bg-night-950 px-4 sm:px-6 pt-5 pb-4 text-white animate-fade-in">

      {/* Header */}
      <div className="mb-5 shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight">Messenger</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your subscriptions and chats</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 mb-4 flex-wrap shrink-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all ${
              activeTab === id ? "ember-gradient shadow-lg shadow-ember/30" : "bg-night-800 hover:bg-night-700"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-night-900 border border-white/5 rounded-3xl p-4 sm:p-5 animate-fade-up">
        {activeTab === "connections" && <ConnectionsTab />}
        {activeTab === "requests"    && <RequestsTab />}
        {activeTab === "chats"       && <ChatsTab />}
        {activeTab === "blocked"     && <BlockedTab />}
      </div>

    </div>
  ) : (
    <div className="h-[calc(100dvh-4rem)] bg-night-950 flex flex-col items-center justify-center gap-5 px-4 text-white">
      <MessageCircleMore size={56} className="text-ember-soft" />
      <h2 className="text-2xl font-bold text-center">
        Sign in to view your messages
      </h2>
      <p className="text-gray-400 text-center text-sm max-w-xs">
        Log in to send chat requests, view your conversations and messages
      </p>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mt-2 ember-gradient shadow-lg shadow-ember/30 text-white font-semibold px-6 py-2.5 rounded-full hover:brightness-110 transition-all duration-200 cursor-pointer"
      >
        <Home size={16} />
        Back to Home
      </button>
    </div>
  );
}