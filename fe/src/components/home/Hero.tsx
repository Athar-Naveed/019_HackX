"use client";

import {
  fadeInUp,
  staggerChildren,
} from "@/utils/helpers/framer-motion-helper";
import { motion } from "framer-motion";
import { ArrowRight, ListTodo, PieChart, TrendingUp } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#101828] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#465fff]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#465fff]/10 rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40"
      >
        <motion.div variants={fadeInUp} className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white leading-tight">
            Master Your Money & Tasks
            <br />
            <span className="text-[#465fff]">All in One Place</span>
          </h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg leading-relaxed text-white/70 max-w-2xl mx-auto"
          >
            Take control of your finances and productivity with ExpenseFlow.
            Track expenses, manage tasks, and achieve your goals with our
            all-in-one solution.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center mt-10 gap-4 sm:gap-x-6"
          >
            <Link
              href="/signup"
              className="group w-full sm:w-auto bg-[#465fff] text-white px-8 py-3 rounded-lg hover:bg-[#465fff]/90 transition-all duration-300 flex items-center justify-center gap-x-2 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 text-white bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-[#465fff] transition-colors">
              <PieChart className="h-5 w-5 text-[#465fff]" />
              <span className="font-medium">Smart Expense Tracking</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-[#465fff] transition-colors">
              <ListTodo className="h-5 w-5 text-[#465fff]" />
              <span className="font-medium">Task Management</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-[#465fff] transition-colors">
              <TrendingUp className="h-5 w-5 text-[#465fff]" />
              <span className="font-medium">Financial Insights</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
