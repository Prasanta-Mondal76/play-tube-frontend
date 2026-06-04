import { useState, useEffect } from "react";
import { LucideVideo, Eye, Heart, Users2, MessageSquareMore } from "lucide-react"
import { getDashStats } from "../../services/dashboardApi";

const WaveChart = ({ color, gradientId }) => {
  return (
    <svg viewBox="0 0 300 60" className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,40 C20,38 30,30 50,32 C70,34 80,25 100,28 C120,31 130,22 150,24 C170,26 180,18 200,20 C220,22 235,15 255,17 C270,19 285,14 300,16 L300,60 L0,60 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M0,40 C20,38 30,30 50,32 C70,34 80,25 100,28 C120,31 130,22 150,24 C170,26 180,18 200,20 C220,22 235,15 255,17 C270,19 285,14 300,16"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export function DashOverview() {

  const [channel, setChannel] = useState({})

  const uploadedVideos = 500
  const totalViews = "987B"
  const totalLikes = "5T"
  const totalSubs = "863M"
  const messages = "681K"
  const totalSubscribtion = 361



  useEffect(() => {
    const fetchDashboardStats = async () => {
      let result;
      try {
        result = await getDashStats();
        setChannel(result.data.data);
      } catch (error) {
        console.log(error);
        setChannel({ message: error.response?.data?.message || "Something went wrong" });
      }
    };
    fetchDashboardStats()
  }, []);

  return (
    (channel?.message) ? <h2>{channel.message}</h2> :
      <div className=" w-full h-full flex items-center p-8 justify-between" >
        <div
          className="rounded-2xl p-5 w-full h-full"

        >
          {/* Top row: 3 cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Total Videos */}
            <div
              className="rounded-xl p-5 flex flex-col justify-between overflow-hidden relative
            bg-[linear-gradient(145deg,#0d1f3c_0%,#091428_100%)]
            border-[1.5px]
            border-[#3b82f659]
            shadow-[inset_0_0_30px_#3b82f614]
            min-h-50
            "
            >
              <div>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4 bg-[#3b82f633]"
                >
                  <LucideVideo size={22} color="#60a5fa" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Videos</p>
                <p className="text-white font-bold text-4xl tracking-tight">{channel.totalVideos}</p>
                <p className="text-gray-500 text-xs mt-1">All uploaded videos</p>
              </div>
              <div className="mt-3">
                <WaveChart color="#3b82f6" gradientId="blueGrad" />
              </div>
            </div>

            {/* Total Views */}
            <div
              className="rounded-xl p-5 flex flex-col justify-between overflow-hidden relative
              bg-[linear-gradient(145deg,#0a2520_0%,#061a15_100%)]
              border-[1.5px]
            border-[#10b98159]
              shadow-[inset_0_0_30px_#10b98114]
              min-h-50
            "
            >
              <div>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4 bg-[#10b98133]"
                >
                  <Eye size={22} color="#34d399" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Views</p>
                <p className="text-white font-bold text-4xl tracking-tight">{channel.totalViews}</p>
                <p className="text-gray-500 text-xs mt-1">All time views</p>
              </div>
              <div className="mt-3">
                <WaveChart color="#10b981" gradientId="greenGrad" />
              </div>
            </div>

            {/* Total Likes */}
            <div
              className="rounded-xl p-5 flex flex-col justify-between overflow-hidden relative
            bg-[linear-gradient(145deg,#2a0d1e_0%,#1a0712_100%)]
            border-[1.5px]
            border-[#ec489959]
            shadow-[0_0_30px_ec489914]
            min-h-50
            "
            >
              <div>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4 bg-[#ec489933]"
                >
                  <Heart size={22} color="#f472b6" fill="#f472b6" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Likes</p>
                <p className="text-white font-bold text-4xl tracking-tight">{channel.totalVideoLikes}</p>
                <p className="text-gray-500 text-xs mt-1">All time likes</p>
              </div>
              <div className="mt-3">
                <WaveChart color="#ec4899" gradientId="pinkGrad" />
              </div>
            </div>
          </div>

          {/* Bottom row: 2 cards */}
          <div className="grid md:grid-cols-2 gap-4 ">

            {/* Total Subscribers */}
            <div
              className="rounded-xl p-6 flex flex-col justify-between overflow-hidden relative
              bg-[linear-gradient(145deg,#1a0d2e_0%,#110820_100%)]
              border-[1.5px]
              border-[#8b5cf64d]
              shadow-[inset_0_0_30px_rgba(139,92,246,0.07)]
              min-h-40
            "
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-[#8b5cf633]"
                >
                  <Users2 size={22} color="#a78bfa" />
                </div>
                <p className="text-white font-semibold text-lg">Total Subscribers</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white font-bold text-5xl tracking-tight">{channel.totalSubscribers}</p>
                  <p className="text-gray-500 text-xs mt-2">All subscribers</p>
                </div>
                <div className="opacity-20" >
                  <Users2 size={80} color="#7c3aed" />
                </div>
              </div>
            </div>


            {/* Total Subscribed */}
            <div
              className="rounded-xl p-6 flex flex-col justify-between overflow-hidden relative
              bg-[linear-gradient(145deg,#0f172a_0%,#020617_100%)]
              border-[1.5px]
              border-[#38bdf84d]
              shadow-[inset_0_0_30px_rgba(56,189,248,0.07)]
              min-h-40
            "
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-[#38bdf833]"
                >
                  <Users2 size={22} color="#7dd3fc" />
                </div>
                <p className="text-white font-semibold text-lg">Total Subscription</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white font-bold text-5xl tracking-tight">{channel.totalSubscribedChannels}</p>
                  <p className="text-gray-500 text-xs mt-2">All subscribed channels</p>
                </div>
                <div className="opacity-20">
                  <Users2 size={80} color="#0ea5e9" />
                </div>
              </div>
            </div>

            {/* Total Comments
            <div
              className="rounded-xl p-6 flex flex-col justify-between overflow-hidden relative
              bg-[linear-gradient(145deg,#1f1205_0%,#140c03_100%)]
              border-[1.5px]
              border-[#d977064d]
              shadow-[inset_0_0_30px_#d9770612]
              min-h-40
            "

            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-[#fbbf242e]"
                >
                  <MessageSquareMore size={22} color="#fbbf24" fill="#fbbf24" />
                </div>
                <p className="text-white font-semibold text-lg">Total Comments</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white font-bold text-5xl tracking-tight">{messages}</p>
                  <p className="text-gray-500 text-xs mt-2">All time comments</p>
                </div>
                <div className="opacity-20"  >
                  <MessageSquareMore size={72} color="#d97706" />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>


  );
}
