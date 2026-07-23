import { MessageCircle, Users, Sparkles, Upload } from "lucide-react";
import { motion } from "framer-motion";

const EmptyChat = () => (
  <div className="flex flex-1 items-center justify-center bg-[#0F1117]">
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="px-6 text-center">
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-xl shadow-violet-900/40"><MessageCircle size={42} className="text-white" /></div>
      <h1 className="text-3xl font-bold tracking-tight text-white">Welcome to the conversation</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">This is the beginning of your workspace conversation. Collaborate with your teammates in real time.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {[{ icon: Users, label: "Invite team" }, { icon: Sparkles, label: "Start discussion" }, { icon: Upload, label: "Upload a file" }].map(({ icon: Icon, label }) => <button key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10"><Icon size={17} className="text-violet-400" />{label}</button>)}
      </div>
    </motion.div>
  </div>
);

export default EmptyChat;
