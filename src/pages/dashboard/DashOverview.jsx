import { useState, useEffect } from "react";
import { LucideVideo, Eye, Heart, Users2, MessageSquareMore } from "lucide-react"
import { getDashStats } from "../../services/dashboardApi.js";

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
            bg-[linear-gradient(145deg,#2a0a0e_0%,#170507_100%)]
            border-[1.5px]
            border-[#e5091459]
            shadow-[inset_0_0_30px_#e5091414]
            min-h-50 animate-fade-up transition-transform duration-300 hover:-translate-y-0.5
            "
            >
              <div>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4 bg-[#e5091433]"
                >
                  <LucideVideo size={22} color="#ff8a50" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Videos</p>
                <p className="ember-text font-black text-4xl tracking-tight">{channel.totalVideos}</p>
                <p className="text-gray-500 text-xs mt-1">All uploaded videos</p>
              </div>
              <div className="mt-3">
                <WaveChart color="#e50914" gradientId="redGrad" />
              </div>
            </div>

            {/* Total Views */}
            <div
              className="rounded-xl p-5 flex flex-col justify-between overflow-hidden relative
              bg-[linear-gradient(145deg,#2a1503_0%,#170c02_100%)]
              border-[1.5px]
            border-[#ff6a0059]
              shadow-[inset_0_0_30px_#ff6a0014]
              min-h-50 animate-fade-up transition-transform duration-300 hover:-translate-y-0.5
            "
            >
              <div>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4 bg-[#ff6a0033]"
                >
                  <Eye size={22} color="#ffb37a" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Views</p>
                <p className="ember-text font-black text-4xl tracking-tight">{channel.totalViews}</p>
                <p className="text-gray-500 text-xs mt-1">All time views</p>
              </div>
              <div className="mt-3">
                <WaveChart color="#ff6a00" gradientId="orangeGrad" />
              </div>
            </div>

            {/* Total Likes */}
            <div
              className="rounded-xl p-5 flex flex-col justify-between overflow-hidden relative
            bg-[linear-gradient(145deg,#2a0d16_0%,#1a0710_100%)]
            border-[1.5px]
            border-[#f43f5e59]
            shadow-[inset_0_0_30px_#f43f5e14]
            min-h-50 animate-fade-up transition-transform duration-300 hover:-translate-y-0.5
            "
            >
              <div>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4 bg-[#f43f5e33]"
                >
                  <Heart size={22} color="#fb7185" fill="#fb7185" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Likes</p>
                <p className="ember-text font-black text-4xl tracking-tight">{channel.totalVideoLikes}</p>
                <p className="text-gray-500 text-xs mt-1">All time likes</p>
              </div>
              <div className="mt-3">
                <WaveChart color="#f43f5e" gradientId="roseGrad" />
              </div>
            </div>
          </div>

          {/* Bottom row: 2 cards */}
          <div className="grid md:grid-cols-2 gap-4 ">

            {/* Total Subscribers */}
            <div
              className="rounded-xl p-6 flex flex-col justify-between overflow-hidden relative
              bg-[linear-gradient(145deg,#20060d_0%,#12040a_100%)]
              border-[1.5px]
              border-[#e509144d]
              shadow-[inset_0_0_30px_rgba(229,9,20,0.07)]
              min-h-40 animate-fade-up transition-transform duration-300 hover:-translate-y-0.5
            "
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-[#e5091433]"
                >
                  <Users2 size={22} color="#ff8a50" />
                </div>
                <p className="text-white font-semibold text-lg">Total Subscribers</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="ember-text font-black text-5xl tracking-tight">{channel.totalSubscribers}</p>
                  <p className="text-gray-500 text-xs mt-2">All subscribers</p>
                </div>
                <div className="opacity-20" >
                  <Users2 size={80} color="#e50914" />
                </div>
              </div>
            </div>


            {/* Total Subscribed */}
            <div
              className="rounded-xl p-6 flex flex-col justify-between overflow-hidden relative
              bg-[linear-gradient(145deg,#241a03_0%,#140e02_100%)]
              border-[1.5px]
              border-[#f59e0b4d]
              shadow-[inset_0_0_30px_rgba(245,158,11,0.07)]
              min-h-40 animate-fade-up transition-transform duration-300 hover:-translate-y-0.5
            "
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-[#f59e0b33]"
                >
                  <Users2 size={22} color="#fbbf24" />
                </div>
                <p className="text-white font-semibold text-lg">Total Subscription</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="ember-text font-black text-5xl tracking-tight">{channel.totalSubscribedChannels}</p>
                  <p className="text-gray-500 text-xs mt-2">All subscribed channels</p>
                </div>
                <div className="opacity-20">
                  <Users2 size={80} color="#f59e0b" />
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
