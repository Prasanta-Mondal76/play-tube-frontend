import { ArrowLeft, Rocket, Ticket, MessageCircle, BookOpen, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"

export const HelpAndSupport = () => {
  const navigate = useNavigate()
  const features = [
    {
      icon: Ticket,
      title: "Ticket Support",
      description:
        "Create support tickets and track issue status in real time.",
      progress: 20,
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description:
        "Instantly connect with our support team for quick assistance.",
      progress: 16,
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description:
        "Search guides, tutorials, and troubleshooting articles.",
      progress: 23,
    },
    {
      icon: Users,
      title: "Community Forum",
      description:
        "Ask questions and share knowledge with other creators.",
      progress: 11,
    },
  ];

  function handelNotify(){
    toast.success("We'll notify you when support features become available.")
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-6 cursor-pointer"
        onClick={()=> navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 md:p-12">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
              <Rocket size={16} />
              New Features Coming Soon
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Help & Support
            </h1>

            <p className="text-zinc-400 text-lg max-w-3xl leading-relaxed">
              Our support system is currently under development. We're building
              a better experience that includes live chat, support tickets,
              knowledge base articles, and community discussions.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-medium transition cursor-pointer"
              onClick={ handelNotify }
              >
                Notify Me
              </button>

              <button className="px-6 py-3 rounded-xl border border-zinc-700 hover:border-zinc-500 transition cursor-pointer"
              onClick={ () => navigate("/")}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">
            Upcoming Support Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                  <feature.icon size={22} />
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                </h3>

                <p className="text-zinc-400 text-sm mb-5">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-amber-400 font-medium">
                    Coming Soon
                  </span>

                  <span className="text-xs text-zinc-500">
                    {feature.progress}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${feature.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Placeholder */}
        <div className="mt-10 rounded-3xl border border-blue-900 bg-blue-950/20 p-8">
          <h2 className="text-xl font-semibold mb-3">
            Need Immediate Assistance?
          </h2>

          <p className="text-zinc-400 leading-relaxed">
            Support services are not available yet. We're actively building a
            complete support center to provide faster responses and better help
            resources.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
            🚧 Under Development
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center border-t border-zinc-900 pt-8">
          <h3 className="font-semibold text-lg">PlayTube Support Center</h3>

          <p className="text-zinc-500 text-sm mt-2">
            Version 1.0 • More support tools are currently under development.
          </p>

          <p className="text-zinc-600 text-xs mt-4">
            Thank you for your patience ❤️
          </p>
        </div>
      </div>
    </div>
  );
};
