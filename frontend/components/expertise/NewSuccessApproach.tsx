"use client";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Users,
  FileSearch,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Consult",
    icon: <ClipboardList className="w-4 h-4 sm:w-6 sm:h-6" />,
    description: "Industry Benchmarking / Market Mapping / Budgeting",
    color: "from-[#FF0080] via-[#FF00FF] to-[#8A2BE2]",
    glowColor: "group-hover:shadow-[#FF0080]/50",
  },
  {
    id: 2,
    title: "Access",
    icon: <Users className="w-4 h-4 sm:w-6 sm:h-6" />,
    description: "Recruitment Plan / Search Strategy / Sourcing & Head-hunting",
    color: "from-[#00FF00] via-[#00FFFF] to-[#0080FF]",
    glowColor: "group-hover:shadow-[#00FF00]/50",
  },
  {
    id: 3,
    title: "Assess",
    icon: <FileSearch className="w-4 h-4 sm:w-6 sm:h-6" />,
    description: "Assessment Development / Interview Service",
    color: "from-[#FF3D00] via-[#FF9100] to-[#FFEA00]",
    glowColor: "group-hover:shadow-[#FF3D00]/50",
  },
  {
    id: 4,
    title: "Select",
    icon: <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />,
    description:
      "Candidate & Stakeholder Management / Decisioning & Negotiation",
    color: "from-[#7C4DFF] via-[#536DFE] to-[#00B0FF]",
    glowColor: "group-hover:shadow-[#7C4DFF]/50",
  },
  {
    id: 5,
    title: "Onboard",
    icon: <UserCheck className="w-4 h-4 sm:w-6 sm:h-6" />,
    description: "Candidate Engagements / Client Feedbacks",
    color: "from-[#FF1744] via-[#FF4081] to-[#D500F9]",
    glowColor: "group-hover:shadow-[#FF1744]/50",
  },
];

const MotionCard = motion(Card);

export default function SuccessApproach() {
  return (
    <main className="bg-[#09090B] text-white overflow-x-hidden overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            margin: window.innerWidth < 768 ? "0px" : "-100px",
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white max-w-4xl leading-[110%]">
            Our Success <span className="text-teal-400">Approach</span>
          </h2>
          <p className="text-white text-sm sm:text-base font-medium mt-1 max-w-lg">
            A comprehensive five-step methodology for exceptional results
          </p>
        </motion.div>

        {/* Background Gradient */}
        <div className="relative">
          {/* Reduced blur effect on the background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#FF00FF]/10 via-[#00FFFF]/5 to-[#FF1744]/10 blur-lg -z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          {/* Cards Container */}
          <div className="space-y-3 sm:space-y-4">
            {/* Steps */}
            {steps.map((step, index) => {
              const xInitial =
                window.innerWidth < 768
                  ? "0%"
                  : index % 2 === 0
                    ? "50%"
                    : "-50%";

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: xInitial }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.4,
                    ease: "easeOut",
                  }}
                  viewport={{
                    once: true,
                    margin: window.innerWidth < 768 ? "0px" : "-50px",
                  }}
                >
                  <MotionCard
                    className={`
                      group relative overflow-hidden border-0 rounded-full
                      bg-gradient-to-r ${step.color}
                      transition-all duration-300
                      hover:translate-y-[-0.25rem]
                      hover:shadow-xl ${step.glowColor}
                      hover:scale-[1.01]
                      w-full
                    `}
                  >
                    {/* Reduced blur effect on the overlay */}
                    <motion.div
                      className="absolute inset-0 rounded-full z-10"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                    />

                    <div className="relative p-3 sm:p-4">
                      <div className="flex flex-row items-center gap-3">
                        {/* Icon Container */}
                        <motion.div
                          className="flex-shrink-0"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            delay: 0.5,
                          }}
                        >
                          {/* Removed backdrop-blur-sm from the icon container */}
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform duration-300 group-hover:border-white/50">
                            {step.icon}
                          </div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                          className="flex-grow"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 1.5, delay: 0.6 }}
                        >
                          <div className="flex flex-row items-center gap-2 mb-1">
                            {/* Removed backdrop-blur-sm from the step badge */}
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/30 group-hover:border-white/50 group-hover:bg-white/30 transition-all duration-300">
                              Step {step.id}
                            </span>
                            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:scale-[1.02] transition-transform duration-300">
                              {step.title}
                            </h2>
                          </div>
                          <p className="text-white/80 text-xs sm:text-sm font-medium tracking-wide max-w-2xl">
                            {step.description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </MotionCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
