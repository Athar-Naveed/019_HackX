"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/utils/helpers/framer-motion-helper";
import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-24 bg-[#101828] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#465fff]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#465fff]/10 rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#465fff]/10 backdrop-blur-sm mb-6">
          <Mail className="h-8 w-8 text-[#465fff]" />
        </div>

        <h2 className="text-3xl font-bold mb-4 text-white">Stay Updated</h2>
        <p className="text-white/70 mb-8 text-lg leading-relaxed">
          Get the latest updates on new features and financial tips delivered
          straight to your inbox.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <motion.input
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-5 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:border-[#465fff] focus:ring-2 focus:ring-[#465fff]/20 text-white placeholder:text-white/50 transition-all"
          />
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="px-8 py-3 bg-[#465fff] text-white rounded-lg hover:bg-[#465fff]/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            Subscribe
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default Newsletter;
