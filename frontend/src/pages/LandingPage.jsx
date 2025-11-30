import React from 'react';
import { ShieldCheck, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage({ user }) {
  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden selection:bg-blue-500/30 text-white">
      {/* --- Background Effects --- */}
      
      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 2. Ambient Glowing Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      {/* --- Main Content --- */}
      <div className="relative z-10 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Animated Icon Container */}
        <div className="mb-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-6 rounded-full bg-slate-900 ring-1 ring-white/10 shadow-2xl animate-float">
                <ShieldCheck size={56} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
            </div>
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium uppercase tracking-wider backdrop-blur-md animate-fade-in-up">
            <Sparkles size={12} />
            <span>Official Assignment</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 animate-fade-in-up delay-100">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400 drop-shadow-sm">
            Automate
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
             Reality Labs
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed animate-fade-in-up delay-200">
          Experience the next generation of web interaction. Secure authentication, 
          immersive UI, and real-time data management simulation.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg animate-fade-in-up delay-300">
          {!user ? (
            <>
              {/* Login Button */}
              <Link 
                to="/login" 
                className="group flex-1 relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl leading-none flex items-center justify-center gap-2 font-bold text-white shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-15px_rgba(124,58,237,0.6)] transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Access Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {/* Register Button */}
              <Link 
                to="/register" 
                className="group flex-1 px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 font-bold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
              >
                Create Account
              </Link>
            </>
          ) : (
            /* Dashboard Button */
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl font-bold text-white shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 mx-auto"
            >
              <LayoutDashboard className="w-5 h-5" />
              Enter Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Footer / Copyright */}
      <div className="absolute bottom-6 text-slate-600 text-sm">
        © 2024 Automate Reality Labs. All systems nominal.
      </div>

      {/* --- Custom CSS for Keyframes (You can add this to your global CSS or Tailwind config, but included here for drop-in usage) --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0; /* Start hidden */
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}