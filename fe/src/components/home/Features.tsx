"use client";

import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerChildren,
} from "@/utils/helpers/framer-motion-helper";
import type { FeatureType } from "@/types";
import { features } from "@/data/constants";

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 bg-[#101828] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#465fff]/10 rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeInUp} className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Everything you need to manage your
            <span className="text-[#465fff]"> finances and tasks</span>
          </h2>
          <p className="mt-4 text-xl text-white/70 leading-relaxed">
            Powerful features to help you take control of your financial life
            and daily tasks
          </p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature: FeatureType, index: number) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-[#465fff] transition-all duration-300 hover:bg-white/10"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-[#465fff]/10 text-[#465fff] mb-6 group-hover:bg-[#465fff] group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Features;
