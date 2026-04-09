"use client";

import { Check, ChevronRight, User2, Mail, Phone, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "../lib/utils";

// RGB values for the per-avatar color ring on the stage
const AVATAR_RGB = {
  1: "255, 0, 91",
  2: "255, 125, 16",
  3: "255, 0, 91",
  4: "137, 252, 179",
};

const avatars = [
  {
    id: 1,
    svg: (
      <svg aria-label="Avatar 1" fill="none" height="40" role="img" viewBox="0 0 36 36" width="40" xmlns="http://www.w3.org/2000/svg">
        <title>Avatar 1</title>
        <mask height="36" id=":r111:" maskUnits="userSpaceOnUse" width="36" x="0" y="0">
          <rect fill="#FFFFFF" height="36" rx="72" width="36" />
        </mask>
        <g mask="url(#:r111:)">
          <rect fill="#ff005b" height="36" width="36" />
          <rect fill="#ffb238" height="36" rx="6" transform="translate(9 -5) rotate(219 18 18) scale(1)" width="36" x="0" y="0" />
          <g transform="translate(4.5 -4) rotate(9 18 18)">
            <path d="M15 19c2 1 4 1 6 0" fill="none" stroke="#000000" strokeLinecap="round" />
            <rect fill="#000000" height="2" rx="1" stroke="none" width="1.5" x="10" y="14" />
            <rect fill="#000000" height="2" rx="1" stroke="none" width="1.5" x="24" y="14" />
          </g>
        </g>
      </svg>
    ),
    alt: "Avatar 1",
  },
  {
    id: 2,
    svg: (
      <svg aria-label="Avatar 2" fill="none" height="40" role="img" viewBox="0 0 36 36" width="40" xmlns="http://www.w3.org/2000/svg">
        <title>Avatar 2</title>
        <mask height="36" id=":R4mrttb:" maskUnits="userSpaceOnUse" width="36" x="0" y="0">
          <rect fill="#FFFFFF" height="36" rx="72" width="36" />
        </mask>
        <g mask="url(#:R4mrttb:)">
          <rect fill="#ff7d10" height="36" width="36" />
          <rect fill="#0a0310" height="36" rx="6" transform="translate(5 -1) rotate(55 18 18) scale(1.1)" width="36" x="0" y="0" />
          <g transform="translate(7 -6) rotate(-5 18 18)">
            <path d="M15 20c2 1 4 1 6 0" fill="none" stroke="#FFFFFF" strokeLinecap="round" />
            <rect fill="#FFFFFF" height="2" rx="1" stroke="none" width="1.5" x="14" y="14" />
            <rect fill="#FFFFFF" height="2" rx="1" stroke="none" width="1.5" x="20" y="14" />
          </g>
        </g>
      </svg>
    ),
    alt: "Avatar 2",
  },
  {
    id: 3,
    svg: (
      <svg aria-label="Avatar 3" fill="none" height="40" role="img" viewBox="0 0 36 36" width="40" xmlns="http://www.w3.org/2000/svg">
        <title>Avatar 3</title>
        <mask height="36" id=":r11c:" maskUnits="userSpaceOnUse" width="36" x="0" y="0">
          <rect fill="#FFFFFF" height="36" rx="72" width="36" />
        </mask>
        <g mask="url(#:r11c:)">
          <rect fill="#0a0310" height="36" width="36" />
          <rect fill="#ff005b" height="36" rx="36" transform="translate(-3 7) rotate(227 18 18) scale(1.2)" width="36" x="0" y="0" />
          <g transform="translate(-3 3.5) rotate(7 18 18)">
            <path d="M13,21 a1,0.75 0 0,0 10,0" fill="#FFFFFF" />
            <rect fill="#FFFFFF" height="2" rx="1" stroke="none" width="1.5" x="12" y="14" />
            <rect fill="#FFFFFF" height="2" rx="1" stroke="none" width="1.5" x="22" y="14" />
          </g>
        </g>
      </svg>
    ),
    alt: "Avatar 3",
  },
  {
    id: 4,
    svg: (
      <svg aria-label="Avatar 4" fill="none" height="40" role="img" viewBox="0 0 36 36" width="40" xmlns="http://www.w3.org/2000/svg">
        <title>Avatar 4</title>
        <mask height="36" id=":r1gg:" maskUnits="userSpaceOnUse" width="36" x="0" y="0">
          <rect fill="#FFFFFF" height="36" rx="72" width="36" />
        </mask>
        <g mask="url(#:r1gg:)">
          <rect fill="#d8fcb3" height="36" width="36" />
          <rect fill="#89fcb3" height="36" rx="6" transform="translate(9 -5) rotate(219 18 18) scale(1)" width="36" x="0" y="0" />
          <g transform="translate(4.5 -4) rotate(9 18 18)">
            <path d="M15 19c2 1 4 1 6 0" fill="none" stroke="#000000" strokeLinecap="round" />
            <rect fill="#000000" height="2" rx="1" stroke="none" width="1.5" x="10" y="14" />
            <rect fill="#000000" height="2" rx="1" stroke="none" width="1.5" x="24" y="14" />
          </g>
        </g>
      </svg>
    ),
    alt: "Avatar 4",
  },
];

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const thumbnailVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

export default function ProfileModal({ isOpen, onClose, onComplete, initialData }) {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [username, setUsername] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState("");

  const [isFocused, setIsFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  if (!isOpen) return null;

  const handleAvatarSelect = (avatar) => {
    if (avatar.id === selectedAvatar.id) return;
    setSelectedAvatar(avatar);
  };

  const handleSubmit = () => {
    if (username.trim() && email.trim()) {
      if (onComplete) {
        onComplete({
          username: username.trim(),
          email: email.trim(),
          phone: phone.trim(),
          avatarId: selectedAvatar.id,
        });
      }
      onClose();
    }
  };

  const isValid = username.trim().length >= 3 && email.trim().length >= 3;
  const showError = username.trim().length > 0 && username.trim().length < 3;
  const rgb = AVATAR_RGB[selectedAvatar.id];

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0f19] animate-in slide-in-from-bottom-5 duration-300 overflow-y-auto custom-scrollbar">
      
      {/* Top Header / Close Area */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="flex items-center gap-3 text-white">
           <h1 className="text-xl font-bold tracking-tight">Node Configuration</h1>
        </div>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-all"
        >
          <span className="hidden sm:inline">Close</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          {/* Avatar Stage (Left Column) */}
          <div className="flex flex-col items-center gap-8 bg-slate-900/40 p-12 rounded-3xl border border-slate-800/60 shadow-2xl">
            <div className="space-y-2 text-center">
              <h2 className="font-bold text-2xl text-white tracking-tight">Identity Matrix</h2>
              <p className="text-slate-400 text-sm">Select your visual telemetry anchor</p>
            </div>

            <div className="relative h-56 w-56 my-4">
              <motion.div
                animate={{
                  boxShadow: `0 0 0 4px rgba(${rgb}, 0.55), 0 12px 40px rgba(${rgb}, 0.25)`,
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.45, ease: "easeOut" }
                }
              />
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-[#0b0f19]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedAvatar.id}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-slate-950"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.2, ease: "easeOut" }
                    }
                  >
                    <div className="scale-[5.5] transform">
                      {selectedAvatar.svg}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Thumbnail strip */}
            <motion.div
              animate="animate"
              className="flex gap-4 mt-2"
              initial="initial"
              variants={containerVariants}
            >
              {avatars.map((avatar) => {
                const isSelected = selectedAvatar.id === avatar.id;
                return (
                  <motion.button
                    key={avatar.id}
                    aria-label={`Select ${avatar.alt}`}
                    aria-pressed={isSelected}
                    className={cn(
                      "relative h-16 w-16 overflow-hidden rounded-2xl border-2 bg-slate-950 transition-all duration-200 ease-out",
                      isSelected
                        ? "border-slate-400 opacity-100 ring-2 ring-indigo-500/70 ring-offset-4 ring-offset-[#0b0f19]"
                        : "border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600 hover:scale-105"
                    )}
                    onClick={() => handleAvatarSelect(avatar)}
                    type="button"
                    variants={thumbnailVariants}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="scale-[2.5] transform">{avatar.svg}</div>
                    </div>
                    {isSelected && (
                      <div className="absolute -right-0.5 -bottom-0.5 flex h-6 w-6 items-center justify-center rounded-br-2xl bg-slate-100">
                        <Check className="h-4 w-4 text-slate-900 font-bold" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Form Content (Right Column) */}
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="font-bold text-3xl text-white tracking-tight">Node Credentials</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                Update your verified researcher profile parameters. These configurations sync automatically across the DNA diffusion grid.
              </p>
            </div>

            <div className="space-y-8">
              {/* Username field */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-sm text-slate-300 uppercase tracking-wider" htmlFor="username">
                    Operator Name
                  </label>
                  <span
                    className={cn(
                      "text-xs tabular-nums font-mono transition-colors",
                      username.length >= 18 ? "text-amber-500" : "text-slate-500"
                    )}
                  >
                    {username.length}/20
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="username"
                    autoComplete="off"
                    maxLength={20}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter full name"
                    className={cn(
                      "flex h-14 w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-base font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all",
                      showError && "border-red-500/50 focus:ring-red-500/70"
                    )}
                  />
                  <User2
                    className={cn(
                      "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-200",
                      isFocused ? "text-indigo-400" : "text-slate-500"
                    )}
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-3">
                <label className="block font-semibold text-sm text-slate-300 uppercase tracking-wider" htmlFor="email">
                  Network Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="node@dnadiffusion.com"
                    className="flex h-14 w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-base font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              {/* Phone field */}
              <div className="space-y-3">
                <label className="block font-semibold text-sm text-slate-300 uppercase tracking-wider" htmlFor="phone">
                  Telemetry / Phone Label
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="flex h-14 w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-base font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all"
                  />
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div className="pt-6">
                 <button
                   disabled={!isValid}
                   onClick={handleSubmit}
                   className="group flex h-14 w-full items-center justify-center rounded-xl bg-indigo-600 font-bold text-lg text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                   type="button"
                 >
                   Save Profile Settings
                   <ChevronRight
                     aria-hidden="true"
                     className="ml-2 h-5 w-5 transition-transform duration-200 ease-out group-hover:translate-x-1"
                   />
                 </button>
                 <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">End-To-End Encrypted Verification</p>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
