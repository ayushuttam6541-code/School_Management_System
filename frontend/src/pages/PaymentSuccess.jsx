import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { api } from "@/lib/api";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    api.get(`/payment/status/${sessionId}`)
      .then(({ data }) => setStatus(data.status === "paid" ? "success" : "pending"))
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6" data-testid="payment-success">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <div className="w-10 h-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto" />
        )}
        {status === "success" && (
          <>
            <CheckCircle size={64} weight="fill" className="text-green-500 mx-auto" />
            <h1 className="font-display text-3xl font-bold text-[#1E3A8A] mt-4">Payment Successful</h1>
            <p className="text-slate-600 mt-2">Thank you! Your fee payment has been received. A confirmation email will be sent shortly.</p>
          </>
        )}
        {status === "pending" && (
          <>
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h1 className="font-display text-2xl font-bold text-[#1E3A8A] mt-4">Processing Payment</h1>
            <p className="text-slate-600 mt-2">Your payment is being verified. Please wait a moment.</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle size={64} weight="fill" className="text-red-500 mx-auto" />
            <h1 className="font-display text-2xl font-bold text-[#1E3A8A] mt-4">Payment Issue</h1>
            <p className="text-slate-600 mt-2">We couldn't verify your payment. Please contact the school office if amount was deducted.</p>
          </>
        )}
        <Link to="/" className="inline-block mt-8 px-6 py-3 rounded-full bg-[#1E3A8A] text-white font-semibold hover:bg-[#0f1e5c]">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
