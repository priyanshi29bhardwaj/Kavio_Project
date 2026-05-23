import React, { useState } from "react";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JoinWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinWaitlistModal: React.FC<JoinWaitlistModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !agreed) return;

    setIsSubmitting(true);
    // Simulate booking API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDestination("");
    setAgreed(false);
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-teal/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-xl bg-white rounded-3xl border border-brand-teal/15 shadow-2xl overflow-hidden z-10"
          >
            {/* Header & Close Button */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-brand-teal/5 bg-brand-white">
              <span className="font-space-grotesk text-xs uppercase tracking-[0.2em] text-brand-teal/60 font-bold">
                Waitlist Request
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-brand-teal/5 text-brand-teal/70 hover:text-brand-teal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Area */}
            <div className="p-8">
              {!isSubmitted ? (
                // Form Interface
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-left mb-2">
                    <h3 className="text-2xl font-black text-brand-teal font-urbanist leading-tight">
                      Delegate your search.
                    </h3>
                    <p className="text-sm text-brand-teal/60 font-medium mt-1">
                      Fill out your details to request early beta access.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name input */}
                    <div className="flex flex-col text-left">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-brand-teal/50 mb-1.5 font-space-grotesk">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="px-4 py-3 rounded-lg border border-brand-teal/15 bg-brand-teal/[0.02] text-brand-teal placeholder-brand-teal/30 focus:outline-none focus:border-brand-aqua transition-colors text-sm font-medium font-urbanist"
                      />
                    </div>

                    {/* Email input */}
                    <div className="flex flex-col text-left">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-brand-teal/50 mb-1.5 font-space-grotesk">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="px-4 py-3 rounded-lg border border-brand-teal/15 bg-brand-teal/[0.02] text-brand-teal placeholder-brand-teal/30 focus:outline-none focus:border-brand-aqua transition-colors text-sm font-medium font-urbanist"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone input */}
                    <div className="flex flex-col text-left">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-brand-teal/50 mb-1.5 font-space-grotesk">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="px-4 py-3 rounded-lg border border-brand-teal/15 bg-brand-teal/[0.02] text-brand-teal placeholder-brand-teal/30 focus:outline-none focus:border-brand-aqua transition-colors text-sm font-medium font-urbanist"
                      />
                    </div>

                    {/* Destination input (Aesthetic integration with booking app) */}
                    <div className="flex flex-col text-left">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-brand-teal/50 mb-1.5 font-space-grotesk">
                        Next Dream Destination
                      </label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. HND, Tokyo"
                        className="px-4 py-3 rounded-lg border border-brand-teal/15 bg-brand-teal/[0.02] text-brand-teal placeholder-brand-teal/30 focus:outline-none focus:border-brand-aqua transition-colors text-sm font-medium font-urbanist"
                      />
                    </div>
                  </div>

                  {/* Terms checkbox */}
                  <label className="flex items-start gap-3 text-left cursor-pointer group py-1">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-brand-teal/20 text-brand-aqua focus:ring-brand-aqua cursor-pointer"
                    />
                    <span className="text-[12px] leading-relaxed text-brand-teal/70 font-medium select-none">
                      I agree to let Kaivo match my travel inquiries and process my data in accordance with the{" "}
                      <a href="#" className="underline hover:text-brand-aqua transition-colors font-bold">
                        Privacy Policy
                      </a>.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !name || !email || !agreed}
                    className="group w-full flex items-center justify-between bg-brand-yellow disabled:bg-brand-teal/5 hover:bg-[#F2E555] active:bg-[#ECE030] disabled:text-brand-teal/30 text-brand-teal font-bold font-space-grotesk px-6 py-4 rounded-xl border border-brand-teal/10 shadow-lg transition-all cursor-pointer"
                  >
                    <span>
                      {isSubmitting ? "Processing Reservation..." : "Submit Reservation"}
                    </span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              ) : (
                // Success State / Flight Boarding Ticket mockup
                <div className="flex flex-col items-center py-4">
                  <div className="w-full bg-brand-teal/5 border border-brand-teal/10 rounded-2xl p-6 relative overflow-hidden select-none">
                    {/* Top border ticket dashes */}
                    <div className="absolute top-0 left-0 right-0 h-1 flex justify-between px-4">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-2 h-2 -mt-1 bg-white rounded-full" />
                      ))}
                    </div>

                    <div className="flex justify-between items-start mb-6">
                      <div className="text-left">
                        <span className="text-[10px] font-bold font-space-grotesk text-brand-teal/40 uppercase tracking-widest">
                          Passenger
                        </span>
                        <h4 className="text-lg font-black text-brand-teal font-urbanist leading-tight">
                          {name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold font-space-grotesk text-brand-teal/40 uppercase tracking-widest">
                          Gate
                        </span>
                        <h4 className="text-lg font-bold text-brand-potato font-space-grotesk leading-tight">
                          EARLY-BETA
                        </h4>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-y border-brand-teal/10 py-4 mb-6">
                      <div className="text-left">
                        <h1 className="text-3xl font-black text-brand-teal font-space-grotesk tracking-wide leading-none">
                          YOU
                        </h1>
                        <span className="text-xs font-medium text-brand-teal/60">
                          Origin
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-space-grotesk font-bold text-brand-aqua uppercase tracking-[0.2em]">
                          Flight matched by AI
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-teal/20" />
                          <div className="h-[1px] w-20 bg-dashed border-t border-dashed border-brand-teal/30" />
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-aqua" />
                        </div>
                      </div>

                      <div className="text-right">
                        <h1 className="text-3xl font-black text-brand-aqua font-space-grotesk tracking-wide leading-none">
                          {destination ? destination.toUpperCase().slice(0, 3) : "KAV"}
                        </h1>
                        <span className="text-xs font-medium text-brand-teal/60">
                          {destination || "Kaivo Access"}
                        </span>
                      </div>
                    </div>

                    {/* Barcode section */}
                    <div className="flex flex-col items-center gap-2">
                      {/* Barcode Lines SVG */}
                      <svg viewBox="0 0 200 40" className="w-48 h-10 text-brand-teal" fill="currentColor">
                        <g>
                          <rect x="10" y="0" width="3" height="40" />
                          <rect x="15" y="0" width="1" height="40" />
                          <rect x="18" y="0" width="4" height="40" />
                          <rect x="25" y="0" width="2" height="40" />
                          <rect x="30" y="0" width="1" height="40" />
                          <rect x="33" y="0" width="3" height="40" />
                          <rect x="40" y="0" width="6" height="40" />
                          <rect x="48" y="0" width="2" height="40" />
                          <rect x="52" y="0" width="1" height="40" />
                          <rect x="55" y="0" width="4" height="40" />
                          <rect x="62" y="0" width="3" height="40" />
                          <rect x="68" y="0" width="1" height="40" />
                          <rect x="71" y="0" width="5" height="40" />
                          <rect x="80" y="0" width="2" height="40" />
                          <rect x="85" y="0" width="1" height="40" />
                          <rect x="89" y="0" width="4" height="40" />
                          <rect x="95" y="0" width="3" height="40" />
                          <rect x="100" y="0" width="1" height="40" />
                          <rect x="104" y="0" width="6" height="40" />
                          <rect x="112" y="0" width="2" height="40" />
                          <rect x="117" y="0" width="1" height="40" />
                          <rect x="120" y="0" width="3" height="40" />
                          <rect x="125" y="0" width="5" height="40" />
                          <rect x="132" y="0" width="1" height="40" />
                          <rect x="135" y="0" width="4" height="40" />
                          <rect x="141" y="0" width="2" height="40" />
                          <rect x="145" y="0" width="1" height="40" />
                          <rect x="148" y="0" width="5" height="40" />
                          <rect x="155" y="0" width="2" height="40" />
                          <rect x="160" y="0" width="6" height="40" />
                          <rect x="168" y="0" width="3" height="40" />
                          <rect x="173" y="0" width="1" height="40" />
                          <rect x="176" y="0" width="4" height="40" />
                          <rect x="182" y="0" width="2" height="40" />
                          <rect x="186" y="0" width="3" height="40" />
                        </g>
                      </svg>
                      <span className="text-[10px] font-space-grotesk tracking-widest text-brand-teal/50 uppercase">
                        BOARDING PASS / KAIVO-001
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mt-6 text-center max-w-sm">
                    <CheckCircle2 className="w-12 h-12 text-brand-aqua mb-2 animate-bounce" />
                    <h3 className="text-xl font-black text-brand-teal font-urbanist">
                      Reservation Confirmed!
                    </h3>
                    <p className="text-sm text-brand-teal/70 font-medium mt-1">
                      Thank you! We've registered your ticket. You'll receive a confirmation email at{" "}
                      <span className="text-brand-potato font-bold">{email}</span> shortly.
                    </p>
                  </div>

                  {/* Reset/Close button */}
                  <button
                    onClick={handleReset}
                    className="mt-8 px-6 py-2.5 bg-brand-teal text-white hover:bg-brand-teal/90 rounded-lg text-sm font-bold font-space-grotesk cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
