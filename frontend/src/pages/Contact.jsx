import { useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { MapPin, Phone, EnvelopeSimple, Clock } from "@phosphor-icons/react";
import { api, formatApiErrorDetail, SCHOOL } from "@/lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Admission Enquiry", message: "" });
  const [busy, setBusy] = useState(false);
  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", subject: "Admission Enquiry", message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Failed to send");
    } finally { setBusy(false); }
  };

  return (
    <div data-testid="contact-page">
      <Toaster position="top-center" richColors />
      <section className="relative py-24 bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Contact</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold mt-3 leading-tight">Say <span className="italic gradient-text-gold">hello</span></h1>
          <p className="mt-4 text-blue-100 text-lg max-w-2xl">Have a question about admissions, fees or facilities? Reach us — we usually respond within a day.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: MapPin, label: "Address", value: SCHOOL.address },
              { icon: Phone, label: "Call", value: SCHOOL.phones.join(", ") },
              { icon: EnvelopeSimple, label: "Email", value: SCHOOL.email },
              { icon: Clock, label: "Office Timing", value: "Mon–Sat, 8:00 AM – 4:30 PM" },
            ].map((c) => (
              <div key={c.label} className="rounded-3xl border border-slate-200 p-6 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A] text-amber-400 flex items-center justify-center shrink-0"><c.icon size={22} weight="duotone"/></div>
                <div>
                  <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider">{c.label}</div>
                  <div className="text-[#1E3A8A] font-semibold mt-1">{c.value}</div>
                </div>
              </div>
            ))}
            <div className="rounded-3xl overflow-hidden h-64 border border-slate-200">
              <iframe title="map" src="https://www.google.com/maps?q=Harnaut+Nalanda+Bihar&output=embed" width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
            </div>
          </div>

          <motion.form initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} onSubmit={submit} className="lg:col-span-3 rounded-3xl border border-slate-200 p-8 bg-slate-50" data-testid="contact-form">
            <h3 className="font-display text-2xl font-bold text-[#1E3A8A]">Send us a message</h3>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Field label="Your Name" testId="contact-name" value={form.name} onChange={change("name")} required />
              <Field label="Email" testId="contact-email" type="email" value={form.email} onChange={change("email")} required />
              <Field label="Phone" testId="contact-phone" value={form.phone} onChange={change("phone")} required />
              <Field label="Subject" testId="contact-subject" value={form.subject} onChange={change("subject")} />
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</label>
              <textarea data-testid="contact-message" value={form.message} onChange={change("message")} required rows={5} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
            </div>
            <button data-testid="contact-submit" disabled={busy} className="mt-6 px-7 py-3 rounded-full bg-[#1E3A8A] hover:bg-[#0f1e5c] text-white font-semibold shadow-lg disabled:opacity-60">{busy ? "Sending…" : "Send Message"}</button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}

function Field({ label, testId, ...rest }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
      <input {...rest} data-testid={testId} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
    </div>
  );
}
