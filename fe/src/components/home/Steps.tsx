"use client";

import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerChildren,
} from "@/utils/helpers/framer-motion-helper";
import { steps } from "@/data/constants";
import type { StepType } from "@/types";

const Steps = () => {
  return (
    <section className="py-24 bg-[#101828] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#465fff]/10 rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeInUp} className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Get Started in{" "}
            <span className="text-[#465fff]">Three Simple Steps</span>
          </h2>
          <p className="mt-4 text-xl text-white/70 leading-relaxed">
            Start your journey to better financial management today
          </p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {steps.map((step: StepType, index: number) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-[#465fff] transition-all duration-300 hover:bg-white/10 h-full">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#465fff] text-white shadow-lg">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#465fff]/20 backdrop-blur-sm text-[#465fff] font-bold text-sm border border-[#465fff]/30">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {/* Connection line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#465fff]/30" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Steps;
