import { useState } from "react";
import { loginApi } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { useCompetitionStore } from "@/store/competitionStore";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function DarkMarkLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { initializeUser } = useCompetitionStore();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      
      // Store Token
      localStorage.setItem("token", res.session?.access_token || "");
      
      // Initialize Zustand Store
      if (res.user) {
        await initializeUser(res.user.id, res.user.email || "");
        
        // RE-FETCH to get is_dark_mark (already handled in initializeUser, but let's check state)
        const state = useCompetitionStore.getState();
        
        if (!state.isDarkMark && !res.isAdmin) {
          toast.error("Access Denied: You are not registered for the Dark Mark Bounty.");
          setLoading(false);
          return;
        }

        // REDIRECT LOGIC
        if (res.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/"); // Goes to CompetitionLayout which handles waiting
        }
      }

    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#021516] text-white p-4">
      <div className="w-full max-w-[420px] p-8 rounded-2xl border border-[#d4af37]/20 bg-[#051112] shadow-[0_0_50px_rgba(181,255,240,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mb-4 border border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Shield className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h2 className="text-3xl font-bold tracking-widest font-wizard text-[#FFD700] text-center uppercase">
            Bounty Access
          </h2>
          <p className="text-[#B5FFF0]/40 text-xs mt-2 uppercase tracking-[0.2em] font-medium">Order of the Obscure Code</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block ml-1 tracking-wider">Identificaton</label>
            <input
              className="w-full p-3 bg-black/40 border border-[#d4af37]/20 rounded-xl focus:outline-none focus:border-[#d4af37]/60 text-white placeholder:text-gray-700 transition-all"
              placeholder="wizard@technetics.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block ml-1 tracking-wider">Passphrase</label>
            <input
              className="w-full p-3 bg-black/40 border border-[#d4af37]/20 rounded-xl focus:outline-none focus:border-[#d4af37]/60 text-white placeholder:text-gray-700 transition-all font-mono"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-linear-to-r from-[#8a6e2e] to-[#d4af37] hover:from-[#d4af37] hover:to-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3 rounded-xl font-wizard font-bold text-xl text-black shadow-lg shadow-[#d4af37]/20 mt-4 active:scale-95"
          >
            {loading ? "VERIFYING..." : "ENTER CHAMBER"}
          </button>
        </div>
      </div>
    </div>
  );
}

