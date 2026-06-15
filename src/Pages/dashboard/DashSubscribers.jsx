import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Users, Clock, ChevronDown, Loader2, AlertCircle, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { getPaymentStatus, createOrder, verifyPayment } from "../../services/paymentApi";
import { getChannelSubscribers } from "../../services/subscriptionApi";
import { LoginContext } from "../../context/LoginContextProvider";

const PLANS = [
  { id: "plan_1hr",  price: "₹10",  duration: "1 Hour",   description: "Quick peek",     highlight: false },
  { id: "plan_5hr",  price: "₹20",  duration: "5 Hours",  description: "Half day access", highlight: true  },
  { id: "plan_2day", price: "₹50",  duration: "2 Days",   description: "Weekend access",  highlight: false },
  { id: "plan_15day",price: "₹100", duration: "15 Days",  description: "Best value",      highlight: false },
];

function formatTimeLeft(expiresAt) {
  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Subscriber Card ────────────────────────────────────────────────────────────
function SubscriberCard({ subscriber }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/profile/${subscriber.username}`)}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800
                 hover:border-violet-500/50 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={subscriber.avatar || "/default-avatar.png"}
          alt={subscriber.fullName}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-zinc-700 group-hover:ring-violet-500/50 transition-all"
        />
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
          {subscriber.fullName}
        </p>
        <p className="text-xs text-zinc-500 truncate mt-0.5">@{subscriber.username}</p>
      </div>

      {/* Arrow */}
      <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-violet-400 shrink-0 transition-colors" />
    </div>
  );
}

// ── Payment Modal ──────────────────────────────────────────────────────────────
function PaymentModal({ onSuccess, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    if (!selectedPlan) return;
    setError("");
    setPaying(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay. Check your connection.");

      const { data } = await createOrder(selectedPlan.id);
      const { orderId, amount, currency, keyId, planLabel } = data.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "PlayTube Creator",
        description: `Subscriber access — ${planLabel}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onSuccess();
          } catch {
            setError("Payment received but verification failed. Contact support.");
            setPaying(false);
          }
        },
        prefill: {},
        theme: { color: "#7c3aed" },
        modal: { ondismiss: () => setPaying(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
      setPaying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="relative px-6 pt-8 pb-5 text-center border-b border-zinc-800/60">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600/20 mb-4 mx-auto">
            <Crown className="h-7 w-7 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Unlock Subscriber Access</h2>
          <p className="text-sm text-zinc-400 mt-1">Choose a plan to view who subscribed to you</p>
        </div>

        {/* Plans */}
        <div className="p-5 grid grid-cols-2 gap-3">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                  ${isSelected
                    ? "border-violet-500 bg-violet-600/10 shadow-lg shadow-violet-500/10"
                    : "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 hover:bg-zinc-800/60"
                  }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-2.5 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white tracking-wide">
                    POPULAR
                  </span>
                )}
                <p className="text-2xl font-black text-white">{plan.price}</p>
                <p className="text-xs font-bold text-zinc-300 mt-1 uppercase tracking-wide">{plan.duration}</p>
                <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mb-3 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="px-5 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-zinc-700 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={!selectedPlan || paying}
            className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700
                       disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold text-white
                       transition cursor-pointer flex items-center justify-center gap-2
                       shadow-lg shadow-violet-600/30"
          >
            {paying ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
            ) : selectedPlan ? (
              <>Pay {selectedPlan.price} <ArrowRight className="h-4 w-4" /></>
            ) : (
              "Select a plan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse">
      <div className="h-12 w-12 rounded-full bg-zinc-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 rounded-full bg-zinc-800" />
        <div className="h-3 w-20 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export function DashSubscribers() {
  const { user } = useContext(LoginContext);

  const [payStatus, setPayStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [subError, setSubError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function checkStatus() {
      try {
        const { data } = await getPaymentStatus();
        setPayStatus(data.data);
      } catch {
        setPayStatus({ active: false });
      }
    }
    checkStatus();
  }, []);

  const loadSubscribers = useCallback(async (cursor = null) => {
    if (!user?._id) return;
    setLoadingSubscribers(true);
    setSubError("");
    try {
      const { data } = await getChannelSubscribers(user._id, { cursor, limit: 20 });
      const { subscribers: newSubs, pagination } = data.data;
      setSubscribers((prev) => cursor ? [...prev, ...newSubs] : newSubs);
      setNextCursor(pagination.nextCursor);
      setHasNextPage(pagination.hasNextPage);
      if (!cursor) setTotalCount(pagination.count);
    } catch {
      setSubError("Couldn't load subscribers. Please refresh.");
    } finally {
      setLoadingSubscribers(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (payStatus?.active) loadSubscribers();
  }, [payStatus?.active, loadSubscribers]);

  async function handlePaymentSuccess() {
    setShowModal(false);
    const { data } = await getPaymentStatus();
    setPayStatus(data.data);
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!payStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </div>
    );
  }

  // ── No Payment ────────────────────────────────────────────────────────────
  if (!payStatus.active) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
              <Users className="h-12 w-12 text-violet-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <Crown className="h-4 w-4 text-yellow-400" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Your Subscribers</h1>
          <p className="text-zinc-400 text-sm max-w-xs mb-2">
            See exactly who's subscribed to your channel.
          </p>
          <p className="text-zinc-600 text-xs mb-8">
            Access is time-limited — starting at just ₹10
          </p>

          {/* Pricing preview */}
          <div className="flex gap-2 mb-8 flex-wrap justify-center">
            {PLANS.map((p) => (
              <span key={p.id} className="text-xs px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                {p.price} · {p.duration}
              </span>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700
                       text-white font-bold text-sm transition cursor-pointer flex items-center gap-2
                       shadow-xl shadow-violet-600/30"
          >
            <Crown className="h-4 w-4" />
            Unlock Access
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {showModal && (
          <PaymentModal onSuccess={handlePaymentSuccess} onClose={() => setShowModal(false)} />
        )}
      </>
    );
  }

  // ── Active Payment — Subscriber List ──────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pt-16">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Subscribers</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {subscribers.length > 0
              ? `Showing ${subscribers.length} subscriber${subscribers.length !== 1 ? "s" : ""}`
              : "People subscribed to your channel"}
          </p>
        </div>

        {/* Timer badge */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
            <Clock className="h-3.5 w-3.5" />
            {formatTimeLeft(payStatus.expiresAt)}
          </div>
          <p className="text-[10px] text-zinc-600 pr-1">{payStatus.planLabel} plan</p>
        </div>
      </div>

      {/* Error */}
      {subError && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {subError}
        </div>
      )}

      {/* Skeleton */}
      {loadingSubscribers && subscribers.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loadingSubscribers && subscribers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-zinc-700" />
          </div>
          <p className="text-zinc-400 font-medium">No subscribers yet</p>
          <p className="text-zinc-600 text-sm mt-1">Keep creating — your audience is coming!</p>
        </div>
      )}

      {/* Subscriber grid */}
      {subscribers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subscribers.map((sub) => (
            <SubscriberCard key={sub._id} subscriber={sub.subscriber} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => loadSubscribers(nextCursor)}
            disabled={loadingSubscribers}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-zinc-700
                       text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600
                       transition disabled:opacity-50 cursor-pointer font-medium"
          >
            {loadingSubscribers
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading…</>
              : <><ChevronDown className="h-4 w-4" /> Load more</>
            }
          </button>
        </div>
      )}
    </div>
  );
}