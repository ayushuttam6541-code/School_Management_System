import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, CreditCard } from "@phosphor-icons/react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";

const FEES = [
  { class: "Nursery – LKG", admission: 5000, monthly: 1200, annual: 3000 },
  { class: "UKG – Class II", admission: 6000, monthly: 1500, annual: 3500 },
  { class: "Class III – V", admission: 7000, monthly: 1800, annual: 4000 },
  { class: "Class VI – VIII", admission: 8000, monthly: 2200, annual: 4500 },
];

const OPTIONAL = [
  { name: "Transport", price: "₹800 – ₹1,500 / month (by distance)" },
  { name: "Hostel", price: "₹6,000 / month (incl. food)" },
  { name: "Uniform + Books", price: "One-time, at cost" },
];

const INCLUDED = [
  "Smart digital classroom",
  "Monthly assessments",
  "Extra classes for weak students",
  "Olympiad & NEET/JEE foundation",
  "Arts, dance and yoga",
  "Personality development",
];

export default function FeeStructure() {
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [payForm, setPayForm] = useState({
    classIndex: 0,
    feeType: "monthly",
    studentName: "",
    email: "",
  });
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.get("/payment/config")
      .then(({ data }) => setPaymentEnabled(data.enabled))
      .catch(() => setPaymentEnabled(false));
  }, []);

  const selectedFee = FEES[payForm.classIndex];
  const amount = payForm.feeType === "admission"
    ? selectedFee.admission
    : payForm.feeType === "annual"
    ? selectedFee.annual
    : selectedFee.monthly;

  const handlePay = async (e) => {
    e.preventDefault();
    if (!payForm.email || !payForm.studentName) {
      toast.error("Please fill in student name and email.");
      return;
    }
    setPaying(true);
    try {
      const { data } = await api.post("/payment/create-checkout", {
        amount: amount * 100,
        description: `${payForm.feeType.charAt(0).toUpperCase() + payForm.feeType.slice(1)} Fee — ${selectedFee.class}`,
        email: payForm.email,
        student_name: payForm.studentName,
        fee_type: payForm.feeType,
      });
      window.location.href = data.checkout_url;
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
      setPaying(false);
    }
  };

  return (
    <div data-testid="fees-page">
      <section className="relative py-24 bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Fees 2026-27</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold mt-3 leading-tight max-w-3xl">Transparent, affordable, <span className="italic gradient-text-gold">honest.</span></h1>
          <p className="mt-4 text-blue-100 max-w-2xl">Full breakdown of what you pay — nothing hidden. Sibling discount 10%, scholarship for meritorious students.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left" data-testid="fees-table">
              <thead className="bg-[#1E3A8A] text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Class</th>
                  <th className="px-6 py-4 font-semibold">Admission Fee</th>
                  <th className="px-6 py-4 font-semibold">Monthly Fee</th>
                  <th className="px-6 py-4 font-semibold">Annual Fee</th>
                </tr>
              </thead>
              <tbody>
                {FEES.map((f, i) => (
                  <tr key={f.class} className={i % 2 ? "bg-slate-50" : ""}>
                    <td className="px-6 py-4 font-display font-semibold text-[#1E3A8A]">{f.class}</td>
                    <td className="px-6 py-4">₹{f.admission.toLocaleString()}</td>
                    <td className="px-6 py-4">₹{f.monthly.toLocaleString()}</td>
                    <td className="px-6 py-4">₹{f.annual.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <div className="mt-14 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#1E3A8A]">What's included</h3>
              <ul className="mt-5 space-y-3">
                {INCLUDED.map((x) => (
                  <li key={x} className="flex gap-3 text-slate-700"><CheckCircle size={22} weight="fill" className="text-amber-500 shrink-0" /> {x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-[#1E3A8A]">Optional</h3>
              <div className="mt-5 space-y-3">
                {OPTIONAL.map((o) => (
                  <div key={o.name} className="rounded-2xl border border-slate-200 p-5">
                    <div className="font-semibold text-[#1E3A8A]">{o.name}</div>
                    <div className="text-sm text-slate-600 mt-1">{o.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-8">
            <CreditCard size={40} weight="duotone" className="text-[#1E3A8A] mx-auto" />
            <h2 className="font-display text-3xl font-bold text-[#1E3A8A] mt-3">Pay Fees Online</h2>
            <p className="text-slate-500 mt-2">Secure payment via Stripe. You'll receive an email receipt.</p>
          </div>

          {paymentEnabled ? (
            <form onSubmit={handlePay} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4" data-testid="fee-payment-form">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Student Name</label>
                <input
                  required
                  value={payForm.studentName}
                  onChange={(e) => setPayForm((f) => ({ ...f, studentName: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Parent Email</label>
                <input
                  required
                  type="email"
                  value={payForm.email}
                  onChange={(e) => setPayForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                  placeholder="For receipt"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase">Class</label>
                  <select
                    value={payForm.classIndex}
                    onChange={(e) => setPayForm((f) => ({ ...f, classIndex: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
                  >
                    {FEES.map((f, i) => (
                      <option key={f.class} value={i}>{f.class}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase">Fee Type</label>
                  <select
                    value={payForm.feeType}
                    onChange={(e) => setPayForm((f) => ({ ...f, feeType: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <option value="monthly">Monthly Fee</option>
                    <option value="admission">Admission Fee</option>
                    <option value="annual">Annual Fee</option>
                  </select>
                </div>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-slate-600">Amount to pay</span>
                <span className="text-2xl font-bold text-[#1E3A8A]">₹{amount.toLocaleString()}</span>
              </div>
              <button
                type="submit"
                disabled={paying}
                data-testid="pay-fees-btn"
                className="w-full py-3 rounded-full bg-[#1E3A8A] hover:bg-[#0f1e5c] text-white font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                {paying ? "Redirecting to payment…" : `Pay ₹${amount.toLocaleString()}`}
              </button>
            </form>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p>Online payment is being set up. For now, please pay fees at the school office or call <strong>8986233963</strong>.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
