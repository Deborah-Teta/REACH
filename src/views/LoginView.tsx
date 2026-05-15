import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, ShieldCheck, Zap, BarChart3, Lock } from 'lucide-react';

export const LoginView: React.FC = () => {
  const handleLogin = () => {
    alert('Dummy login enabled for this demo.');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex bg-zinc-900 p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-800/50 blur-[120px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-zinc-800/30 blur-[100px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white text-zinc-900 rounded-2xl flex items-center justify-center font-bold text-2xl tracking-tighter mb-8">
            R
          </div>
          <h1 className="text-6xl font-bold text-white tracking-tighter leading-tight mb-6">
            Lending that <br />
            moves <span className="italic font-serif text-zinc-400">faster.</span>
          </h1>
          <p className="text-zinc-400 max-w-md text-lg">
            Empowering small businesses with a streamlined, secure, and rapid loan approval process.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 text-white">
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-emerald-400">
               <Zap size={20} /> <span className="font-bold text-sm uppercase tracking-widest">Rapid</span>
             </div>
             <p className="text-sm text-zinc-400">Average approval in under 24 hours.</p>
          </div>
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-emerald-400">
               <ShieldCheck size={20} /> <span className="font-bold text-sm uppercase tracking-widest">Secure</span>
             </div>
             <p className="text-sm text-zinc-400">Enterprise-grade encryption and access controls.</p>
          </div>
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-amber-400">
               <BarChart3 size={20} /> <span className="font-bold text-sm uppercase tracking-widest">Insightful</span>
             </div>
             <p className="text-sm text-zinc-400">Detailed performance reports and analytics.</p>
          </div>
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-rose-400">
               <Lock size={20} /> <span className="font-bold text-sm uppercase tracking-widest">Private</span>
             </div>
             <p className="text-sm text-zinc-400">Your data is strictly isolated and protected.</p>
          </div>
        </div>
      </div>

      {/* Login Side */}
      <div className="flex items-center justify-center p-8 bg-zinc-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-12 rounded-[40px] shadow-2xl shadow-zinc-200 border border-zinc-100"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
            <p className="text-zinc-500">Sign in to manage your loan portfolio</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full py-4 px-6 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-zinc-800 transition-all group"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Continue with Google
            </button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-zinc-400"><span className="bg-white px-4">Authorized Personnel Only</span></div>
            </div>

            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 flex gap-4">
              <div className="mt-1">
                <ShieldCheck size={20} className="text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Encrypted Connection</h4>
                <p className="text-[10px] text-zinc-500">Your session is protected by 256-bit AES encryption and secure OAuth 2.0 protocols.</p>
              </div>
            </div>
          </div>

          <p className="mt-12 text-center text-xs text-zinc-400">
            By signing in, you agree to REACH's <span className="underline underline-offset-4 cursor-pointer">Terms of Service</span> and <span className="underline underline-offset-4 cursor-pointer">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

