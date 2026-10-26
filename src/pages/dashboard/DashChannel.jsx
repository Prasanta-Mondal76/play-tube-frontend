import { useParams } from "react-router-dom";

import { ChannelHeader } from "../../components/dashboard/channel/channelHeader.jsx";
import {ChannelVideoSection} from "../../components/dashboard/channel/channelVideoSection.jsx";


export function DashChannel() {


  return (
    <div className="min-h-screen bg-night-950 text-white px-4 sm:px-6 lg:px-10 py-6 pt-15 animate-fade-in max-w-7xl mx-auto">

      {/* Dashboard Channel Header Section */}
      <ChannelHeader />

      {/* dashboard Channel Video Section */}
      <ChannelVideoSection />

    </div>
  );
}
