export function ProfileTabs({ activeTab, setActiveTab }) {

  const tabs = ["Videos", "About"];

  return (
    <div className="flex border-b border-white/5 mt-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            px-5 py-2.5 text-sm font-semibold transition cursor-pointer
            ${activeTab === tab
              ? "text-white border-b-2 border-transparent [border-image:linear-gradient(92deg,#E50914,#FF6A00)_1]"
              : "text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
