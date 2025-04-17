import { Variants } from 'framer-motion';

// Task item animations
export const taskItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut"
    }
  }),
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  },
  hover: {
    y: -3,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  }
};

// Button animations
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: "0 5px 10px rgba(0,0,0,0.15)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 17
    }
  }
};

// Page transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  enter: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { 
      duration: 0.3,
      ease: "easeIn",
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

// Container stagger animations
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

// Modal animations
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      delay: 0.2,
      duration: 0.3
    }
  }
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.2
    }
  }
};

// Input field animations
export const inputVariants: Variants = {
  initial: { scale: 1 },
  focus: {
    scale: 1.02,
    boxShadow: "0 0 0 2px rgba(var(--primary-rgb), 0.3)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  }
};

// Theme transition animations
export const themeTransitionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1] // cubic-bezier
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

// List item fade in stagger
export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Toast notification animations
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 50, x: 0 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Checkbox animations
export const checkboxVariants: Variants = {
  unchecked: { 
    backgroundColor: "var(--checkbox-bg)",
    borderColor: "var(--checkbox-border)" 
  },
  checked: { 
    backgroundColor: "var(--primary-color)",
    borderColor: "var(--primary-color)",
    transition: { duration: 0.2 }
  }
};

// Checkmark animations
export const checkmarkVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { 
      pathLength: { type: "spring", duration: 0.3, bounce: 0 },
      opacity: { duration: 0.15 }
    }
  }
};

// Dropdown menu animations
export const dropdownVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: -5,
    scale: 0.95,
    transformOrigin: "top"
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0,
    y: -5,
    scale: 0.95,
    transition: { 
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Loader animations
export const loaderVariants: Variants = {
  initial: { rotate: 0 },
  animate: { 
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear"
    }
  }
}; 