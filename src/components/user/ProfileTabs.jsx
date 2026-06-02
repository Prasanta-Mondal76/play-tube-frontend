export function ProfileTabs({ activeTab, setActiveTab }) {

  const tabs = ["Videos", "About"];

  return (
    <div className="flex border-b border-zinc-800 mt-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            px-5 py-2.5 text-sm font-semibold transition cursor-pointer
            ${activeTab === tab
              ? "text-white border-b-2 border-white"
              : "text-zinc-500 hover:text-zinc-300"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
