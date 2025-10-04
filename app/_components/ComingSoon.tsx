import React from "react";
import { motion } from "framer-motion";
import { Bean } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-emerald-100 p-8 rounded-2xl shadow-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full mb-6 shadow-md">
          <Bean className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-semibold text-emerald-900 mb-2">Coming Soon</h1>
        <p className="text-emerald-700 max-w-md mx-auto">
          We’re growing something amazing — an AI-powered crop yield predictor to help farmers boost productivity.
        </p>
        <div className="mt-6 inline-block px-6 py-2 bg-emerald-600 text-white font-medium rounded-full shadow hover:bg-emerald-700 transition">
          Stay Tuned 🌱
        </div>
      </motion.div>
    </div>
  );
}