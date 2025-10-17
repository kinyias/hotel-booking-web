"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

function HeroBanner() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const dividerVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        delay: 0.5
      }
    }
  };

  const diamondVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 45,
      transition: {
        delay: i * 0.2 + 0.8,
        duration: 0.5,
        ease: "backOut" as const
      }
    })
  };

  const headingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut" as const,
        delay: 1.2
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const backgroundVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut" as const
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const blurBackgroundVariants = {
    hidden: { 
      opacity: 0,
      scale: 1.1,
      filter: "blur(20px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: "easeOut" as const,
        delay: 0.3
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/hero-bg.jpg)` }}
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="hidden md:block absolute w-1/2 h-full bg-transparent backdrop-blur-xl border-white/30 border-2 left-1/2 translate-x-[-50%] z-[-10]"
          variants={blurBackgroundVariants}
          initial="hidden"
          animate="visible"
        />
        
        {/* Decorative Divider */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-8 pt-5 md:pt-15"
          variants={itemVariants}
        >
          <motion.div 
            className="h-px w-16 bg-white/50"
            variants={dividerVariants}
            initial="hidden"
            animate="visible"
          />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 border-2 border-white"
                custom={i}
                variants={diamondVariants}
                initial="hidden"
                animate="visible"
              />
            ))}
          </div>
          <motion.div 
            className="h-px w-16 bg-white/50"
            variants={dividerVariants}
            initial="hidden"
            animate="visible"
          />
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-wide"
          variants={headingVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="block" variants={lineVariants}>
            CHỌN PHÒNG LÝ TƯỞNG
          </motion.span>
          <motion.span className="block" variants={lineVariants}>
            TẬN HƯỞNG BÌNH YÊN
          </motion.span>
        </motion.h1>

        {/* CTA Button */}
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="default"
            className="relative overflow-hidden font-semibold text-white bg-primary rounded-none group px-8 py-6 mb-5 md:mb-20"
          >
            <span className="relative z-10 text-md md:text-xl">XEM HỆ THỐNG KHÁCH SẠN</span>
            <span className="absolute inset-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroBanner;