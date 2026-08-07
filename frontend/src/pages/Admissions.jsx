import { useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { CheckCircle, ArrowRight, ArrowLeft, Copy } from "@phosphor-icons/react";
import { api, formatApiErrorDetail } from "@/lib/api";

const CLASSES = ["Nursery","LKG","UKG","Class I","Class II","Class III","Class IV","Class V","Class VI","Class VII","Class VIII"];

const empty = {
  student_name: "", date_of_birth: "", gender: "male", class_applying: "Nursery",
  previous_school: "", blood_group: "",
  father_name: "", father_occupation: "", mother_name: "", mother_occupation: "",
  parent_email: "", parent_phone: "", emergency_contact: "",
  address: "", city: "Harnaut", state: "Bihar", pincode: "803110",
  transport_required: false, hostel_required: false, medical_conditions: "",
  student_photo: "", birth_certificate: "", aadhar: "",
};

const STEPS = ["Student", "Parents", "Address & Options", "Review"];

export default function Admissions() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(empty);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setBusy(true);
    try {
      const { data } = await api.post("/admission/apply", form);
      setResult(data);
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Submission failed");
    } finally { setBusy(false); }
  };

  if (result) {
    return (
      <div data-testid="admission-success" className="min-h-[70vh] bg-slate-50 py-24">
        <Toaster position="top-center" richColors />
        <div className="max-w-2xl mx-auto px-6">
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="rounded-3xl bg-white border border-slate-200 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto"><CheckCircle size={40} weight="fill" /></div>
            <h2 className="font-display text-3xl font-bold text-[#1E3A8A] mt-6">Application Received!</h2>
            <p className="text-slate-600 mt-3">Thank you, {result.father_name}. We've received the application for <b>{result.student_name}</b>.</p>
            <div className="mt-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-5">
              <div className="text-xs uppercase text-slate-500 tracking-wider">Application Number</div>
              <div className="font-display text-2xl font-bold text-[#1E3A8A] mt-1" data-testid="app-number">{result.application_number}</div>
              <button onClick={() => { navigator.clipboard.writeText(result.application_number); toast.success("Copied"); }} className="mt-3 inline-flex items-center gap-2 text-sm text-[#1E3A8A] hover:underline"><Copy size={16}/>Copy</button>
            </div>
            <p className="text-sm text-slate-500 mt-6">Save this number to track your application status. We'll contact you within 3 working days.</p>
            <a href="/track" className="mt-6 inline-block px-6 py-3 rounded-full bg-[#1E3A8A] hover:bg-[#0f1e5c] text-white font-semibold">Track Status</a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="admissions-page" className="bg-slate-50">
      <Toaster position="top-center" richColors />
      <section className="relative py-16 bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Admissions 2026-27</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 leading-tight">Online Admission Form</h1>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm ${i <= step ? "bg-[#1E3A8A] text-white" : "bg-slate-200 text-slate-500"}`}>{i+1}</div>
                <div className={`text-sm font-medium hidden sm:block ${i <= step ? "text-[#1E3A8A]" : "text-slate-400"}`}>{s}</div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-[#1E3A8A]" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          <motion.div key={step} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="rounded-3xl bg-white border border-slate-200 p-8">
            {step === 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <F label="Student Name" testId="f-student-name" required value={form.student_name} onChange={(e)=>set("student_name", e.target.value)} />
                <F label="Date of Birth" testId="f-dob" type="date" required value={form.date_of_birth} onChange={(e)=>set("date_of_birth", e.target.value)} />
                <FSelect label="Gender" testId="f-gender" value={form.gender} onChange={(e)=>set("gender", e.target.value)} options={[["male","Male"],["female","Female"],["other","Other"]]} />
                <FSelect label="Class Applying For" testId="f-class" value={form.class_applying} onChange={(e)=>set("class_applying", e.target.value)} options={CLASSES.map(c=>[c,c])} />
                <F label="Previous School (if any)" testId="f-prev-school" value={form.previous_school} onChange={(e)=>set("previous_school", e.target.value)} />
                <F label="Blood Group" testId="f-blood" value={form.blood_group} onChange={(e)=>set("blood_group", e.target.value)} />
              </div>
            )}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <F label="Father's Name" testId="f-father" required value={form.father_name} onChange={(e)=>set("father_name", e.target.value)} />
                <F label="Father's Occupation" testId="f-father-occ" value={form.father_occupation} onChange={(e)=>set("father_occupation", e.target.value)} />
                <F label="Mother's Name" testId="f-mother" required value={form.mother_name} onChange={(e)=>set("mother_name", e.target.value)} />
                <F label="Mother's Occupation" testId="f-mother-occ" value={form.mother_occupation} onChange={(e)=>set("mother_occupation", e.target.value)} />
                <F label="Parent Email" testId="f-parent-email" type="email" required value={form.parent_email} onChange={(e)=>set("parent_email", e.target.value)} />
                <F label="Parent Phone" testId="f-parent-phone" required value={form.parent_phone} onChange={(e)=>set("parent_phone", e.target.value)} />
                <F label="Emergency Contact" testId="f-emergency" required value={form.emergency_contact} onChange={(e)=>set("emergency_contact", e.target.value)} />
              </div>
            )}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Address</label>
                  <textarea data-testid="f-address" required value={form.address} onChange={(e)=>set("address", e.target.value)} rows={3} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
                </div>
                <F label="City" testId="f-city" required value={form.city} onChange={(e)=>set("city", e.target.value)} />
                <F label="State" testId="f-state" required value={form.state} onChange={(e)=>set("state", e.target.value)} />
                <F label="Pincode" testId="f-pincode" required value={form.pincode} onChange={(e)=>set("pincode", e.target.value)} />
                <div className="sm:col-span-2 flex gap-5 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer"><input data-testid="f-transport" type="checkbox" checked={form.transport_required} onChange={(e)=>set("transport_required", e.target.checked)} className="w-4 h-4 accent-[#1E3A8A]" /> Transport Required</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input data-testid="f-hostel" type="checkbox" checked={form.hostel_required} onChange={(e)=>set("hostel_required", e.target.checked)} className="w-4 h-4 accent-[#1E3A8A]" /> Hostel Required</label>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Medical Conditions / Allergies</label>
                  <textarea data-testid="f-medical" value={form.medical_conditions} onChange={(e)=>set("medical_conditions", e.target.value)} rows={2} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h3 className="font-display text-xl font-bold text-[#1E3A8A]">Review your application</h3>
                <p className="text-sm text-slate-500 mt-1">Please verify the details before submitting.</p>
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  {[
                    ["Student", form.student_name],
                    ["DOB / Gender", `${form.date_of_birth} / ${form.gender}`],
                    ["Class", form.class_applying],
                    ["Father", form.father_name],
                    ["Mother", form.mother_name],
                    ["Email", form.parent_email],
                    ["Phone", form.parent_phone],
                    ["Emergency", form.emergency_contact],
                    ["Address", `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`],
                    ["Transport / Hostel", `${form.transport_required ? "Yes" : "No"} / ${form.hostel_required ? "Yes" : "No"}`],
                  ].map(([k,v]) => (
                    <div key={k} className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{k}</div>
                      <div className="text-sm text-[#1E3A8A] font-medium mt-1">{v || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button data-testid="form-prev" onClick={prev} disabled={step===0} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ArrowLeft size={16}/> Back</button>
              {step < STEPS.length - 1 ? (
                <button data-testid="form-next" onClick={next} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#0f1e5c] text-white font-semibold">Next <ArrowRight size={16}/></button>
              ) : (
                <button data-testid="form-submit" onClick={submit} disabled={busy} className="px-7 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#1E3A8A] font-semibold shadow-lg disabled:opacity-60">{busy ? "Submitting…" : "Submit Application"}</button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function F({ label, testId, ...rest }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
      <input {...rest} data-testid={testId} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" />
    </div>
  );
}
function FSelect({ label, testId, options, ...rest }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
      <select {...rest} data-testid={testId} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]">
        {options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
