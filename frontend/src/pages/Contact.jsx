import { useState } from "react";
import axios from "axios";
import { Loader2, Send, Paperclip, CheckCircle } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [file, setFile] = useState(null);
  const [ticket, setTicket] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (file) formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:8000/api/contact", formData);
      setTicket(res.data.ticket_id);
      setForm({ name: "", email: "", subject: "", message: "" });
      setFile(null);
    } catch (err) {
      alert("❌ Failed to send message");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-slate-900" style={{ backgroundColor: "#f0f6ff", backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)", backgroundSize: "28px 28px" }}>
      {/* TOP ACCENT */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <div className="max-w-2xl mx-auto px-5 py-16">

        {/* HEADER */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-3">Get In Touch</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Contact Support
          </h1>
          <p className="text-slate-500 text-sm">
            Have a question or issue? Submit a ticket and our team will get back to you shortly.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md">

          {!ticket ? (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME + EMAIL ROW */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
                  <input
                    name="name" value={form.name} onChange={handleChange}
                    placeholder="John Smith" required className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address</label>
                  <input
                    name="email" value={form.email} onChange={handleChange}
                    placeholder="john@example.com" required className={inputClass}
                  />
                </div>
              </div>

              {/* SUBJECT */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Subject</label>
                <input
                  name="subject" value={form.subject} onChange={handleChange}
                  placeholder="Brief description of your issue" required className={inputClass}
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="Describe your issue in detail…" required
                  className={`${inputClass} h-36 resize-none`}
                />
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Attachment <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-slate-500 text-sm cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition">
                  <Paperclip size={15} />
                  <span>{file ? file.name : "Click to attach a file"}</span>
                  <input type="file" onChange={handleFile} className="hidden" />
                </label>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all mt-2"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                  : <><Send size={15} /> Submit Ticket</>}
              </button>

            </form>
          ) : (

            /* SUCCESS STATE */
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ticket Submitted!</h3>
              <p className="text-slate-500 text-sm mb-5">Our team will respond to your request shortly.</p>

              <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-6 py-3">
                <p className="text-xs text-slate-400 font-semibold mb-1">Your Ticket ID</p>
                <p className="text-blue-600 font-bold text-lg font-mono">{ticket}</p>
              </div>

              <button
                onClick={() => setTicket("")}
                className="block mx-auto mt-6 text-sm text-slate-500 hover:text-blue-600 underline transition"
              >
                Submit another ticket
              </button>
            </div>

          )}
        </div>

        {/* FOOTER INFO */}
        {!ticket && (
          <p className="text-center text-xs text-slate-400 mt-6">
            Typical response time: <span className="font-semibold text-slate-500">24–48 hours</span>
          </p>
        )}

      </div>
    </div>
  );
}