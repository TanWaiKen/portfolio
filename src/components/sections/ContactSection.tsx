"use client";

import { useState } from "react";
import { Mail, Send, Phone } from "lucide-react";
import "../ui/Button.css";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        console.error(result);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text">Contact Me</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Email Card */}
          <div className="card-glow bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
            <p className="text-white/60 mb-3">tanwaiken552@gmail.com</p>
            <a
              href="mailto:tanwaiken552@gmail.com"
              className="text-primary hover:underline"
            >
              Send a message
            </a>
          </div>

          {/* Phone Card */}
          <div className="card-glow bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
            <p className="text-white/60 mb-3">019-887 6422</p>
            <a
              href="tel:0198876422"
              className="text-primary hover:underline"
            >
              Call me
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-card/50 border border-primary/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 bg-card/50 border border-primary/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
              className="w-full px-4 py-3 bg-card/50 border border-primary/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="contact-submit-btn flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/80 transition-all btn-glow mx-auto"
          >
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <span>
              {status === "loading" ? "Sending..." : status === "success" ? "Message Sent!" : status === "error" ? "Failed! Try Again" : "Send Message!"}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
