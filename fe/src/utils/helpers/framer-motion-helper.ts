export const fadeInUp = {
  hidden: {opacity: 0, y: 20},
  visible: {opacity: 1, y: 0},
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const slideIn = {
  initial: {x: "100%"},
  animate: {x: 0},
  exit: {x: "100%"},
  transition: {type: "tween", duration: 0.3},
};
