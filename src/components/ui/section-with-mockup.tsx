'use client';

import React from "react";
import { motion } from "framer-motion";

interface SectionWithMockupProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  primaryImageSrc: string;
  secondaryImageSrc: string;
  reverseLayout?: boolean;
  badge?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const SectionWithMockup: React.FC<SectionWithMockupProps> = ({
  title,
  description,
  primaryImageSrc,
  secondaryImageSrc,
  reverseLayout = false,
  badge,
}) => {
  const layoutClasses = reverseLayout
    ? "md:grid-cols-2 md:grid-flow-col-dense"
    : "md:grid-cols-2";
  const textOrderClass = reverseLayout ? "md:col-start-2" : "";
  const imageOrderClass = reverseLayout ? "md:col-start-1" : "";

  return (
    <section className="relative py-20 md:py-32 overflow-hidden" style={{ background: "#1A1140" }}>
      <div className="container max-w-[1100px] w-full px-6 md:px-10 relative z-10 mx-auto">
        <motion.div
          className={`grid grid-cols-1 gap-16 md:gap-12 w-full items-center ${layoutClasses}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Texto */}
          <motion.div
            className={`flex flex-col items-start gap-4 mt-10 md:mt-0 max-w-[520px] mx-auto md:mx-0 ${textOrderClass}`}
            variants={itemVariants}
          >
            {badge && (
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".18em",
                textTransform: "uppercase" as const,
                color: "#8B66F7",
              }}>
                {badge}
              </span>
            )}
            <h2 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: 36,
              lineHeight: 1.15,
              color: "#ffffff",
              margin: 0,
            }}>
              {title}
            </h2>
            <div style={{ color: "rgba(201,184,255,.75)", fontSize: 15, lineHeight: 1.75 }}>
              {description}
            </div>
          </motion.div>

          {/* Imagen */}
          <motion.div
            className={`relative mt-10 md:mt-0 mx-auto ${imageOrderClass} w-full`}
            style={{ maxWidth: 480 }}
            variants={itemVariants}
          >
            {/* Fondo decorativo */}
            <motion.div
              className="absolute rounded-[28px] z-0"
              style={{
                width: "85%",
                height: "90%",
                background: "rgba(91,43,239,.12)",
                border: "1px solid rgba(91,43,239,.2)",
                top: reverseLayout ? "auto" : "8%",
                bottom: reverseLayout ? "8%" : "auto",
                left: reverseLayout ? "auto" : "-12%",
                right: reverseLayout ? "-12%" : "auto",
                filter: "blur(1px)",
              }}
              initial={{ y: 0 }}
              whileInView={{ y: reverseLayout ? -16 : -24 }}
              transition={{ duration: 1.2, ease: "easeOut" as const }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <div
                className="w-full h-full rounded-[28px] bg-cover bg-center"
                style={{ backgroundImage: `url(${secondaryImageSrc})` }}
              />
            </motion.div>

            {/* Tarjeta principal */}
            <motion.div
              className="relative rounded-[28px] z-10 overflow-hidden"
              style={{
                height: 400,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(139,102,247,.3)",
                backdropFilter: "blur(16px)",
              }}
              initial={{ y: 0 }}
              whileInView={{ y: reverseLayout ? 16 : 24 }}
              transition={{ duration: 1.2, ease: "easeOut" as const, delay: 0.1 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${primaryImageSrc})` }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Separador inferior */}
      <div
        className="absolute w-full h-px bottom-0 left-0"
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, rgba(139,102,247,.35) 0%, transparent 100%)",
        }}
      />
    </section>
  );
};

export default SectionWithMockup;
