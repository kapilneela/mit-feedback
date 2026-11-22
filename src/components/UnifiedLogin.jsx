import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, AlertCircle, Info } from 'lucide-react';
import { unifiedLogin } from '../services/dataService';

export default function UnifiedLogin({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotHelp, setShowForgotHelp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await unifiedLogin(identifier, password);
      setLoading(false);
      onLoginSuccess(user);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('/campus_bg_clean.jpg')` }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />

      {/* Floating Login Card matching MIT-WPU Portal */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl p-7 sm:p-9 border border-white/40 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Official MIT-WPU Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/mitwpu_logo.png" 
            alt="Dr. Vishwanath Karad MIT World Peace University Pune" 
            className="h-14 sm:h-16 w-auto max-w-[290px] object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="text-[17px] sm:text-[18px] font-bold text-[#0f172a] text-center tracking-tight leading-snug mb-5">
          Department of First Year Engineering
        </h2>

        {/* Subheading */}
        <div className="text-[13px] font-semibold text-slate-700 mb-2">
          Login
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Identifier Input */}
          <div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@mitwpu.edu.in"
              className="w-full bg-[#eef4ff] text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-transparent focus:border-blue-400 focus:outline-hidden focus:ring-2 focus:ring-[#1d68e3]/20 placeholder:text-slate-400 font-medium transition"
              required
            />
          </div>

          {/* Password Input with Eye Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#eef4ff] text-slate-900 text-xs sm:text-sm pl-3.5 pr-10 py-2.5 rounded-lg border border-transparent focus:border-blue-400 focus:outline-hidden focus:ring-2 focus:ring-[#1d68e3]/20 placeholder:text-slate-400 font-medium transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer transition"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Blue Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d68e3] hover:bg-[#1557c0] text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="animate-pulse">Logging in...</span>
            ) : (
              <span>Log in</span>
            )}
          </button>

          {/* Helper Instructions */}
          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
            Please use your MIT-WPU email ID as your login username.<br />
            <span className="text-[10px] text-slate-400">(Students: enter your 10-digit PRN)</span>
          </p>

          {/* Forgot Password Link */}
          <div>
            <button
              type="button"
              onClick={() => setShowForgotHelp(!showForgotHelp)}
              className="text-xs text-[#1d68e3] hover:underline font-medium cursor-pointer"
            >
              Forgot Password?
            </button>

            {showForgotHelp && (
              <div className="mt-2.5 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-slate-700 space-y-1 animate-in fade-in">
                <div className="font-bold text-blue-900 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Default Institutional Passwords</span>
                </div>
                <div>• <strong>Students:</strong> <span className="font-mono text-slate-800">Student@123</span></div>
                <div>• <strong>Faculty / Coordinators:</strong> <span className="font-mono text-slate-800">Teacher@123</span></div>
                <div>• <strong>Academic Admin:</strong> <span className="font-mono text-slate-800">Admin@123</span></div>
                <div className="text-[10px] text-slate-500 pt-1">
                  (Passwords can also be updated inside the Academic Admin Panel)
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
