/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      background: "var(--background-color)",
      foreground: "var(--foreground-color)",
    },
    boxShadow: {
      standard:
        "0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)",
      aesthetic: "0 3px 10px rgb(0,0,0,0.2)",
      derek:
        "0px 0px 0px 1px rgba(0,0,0,0.06),0px 1px 1px -0.5px rgba(0,0,0,0.06),0px 3px 3px -1.5px rgba(0,0,0,0.06), 0px 6px 6px -3px rgba(0,0,0,0.06),0px 12px 12px -6px rgba(0,0,0,0.06),0px 24px 24px -12px rgba(0,0,0,0.06)",
    },
    extend: {
      keyframes: {
        "browse-in": {
          "0%": {
            transform: "scale(0.8) translateZ(0px)",
            zIndex: "-1",
          },
          "10%": {
            transform: "scale(0.8) translateZ(0px)",
            zIndex: "-1",
            opacity: "0.7",
          },
          "80%": {
            transform: "scale(1.05) translateZ(0px)",
            zIndex: "999",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1) translateZ(0px)",
            zIndex: "999",
          },
        },
      },
      "browse-out": {
        "0%": {
          transform: "translateX(0%) rotateY(0deg) rotateX(0deg)",
          zIndex: "999",
        },
        "50%": {
          transform:
            "translateX(-105%) rotateY(35deg) rotateX(10deg) translateZ(-10px)",
          zIndex: "-1",
        },
        "80%": {
          opacity: "1",
        },
        "100%": {
          zIndex: "-1",
          opacity: "0",
          transform:
            "translateX(0%) rotateY(0deg) rotateX(0deg) translateZ(-10px)",
        },
      },
      "fly-out": {
        "0%": {
          transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        },
        "20%": {
          transform: "scale3d(0.9, 0.9, 0.9)",
        },
        "50%, 55%": {
          opacity: "1",
          transform: "scale3d(1.1, 1.1, 1.1)",
        },
        "100%": {
          opacity: "0",
          transform: "scale3d(0.3, 0.3, 0.3)",
        },
      },
      "fly-in": {
        "0%": {
          opacity: "0",
          transform: "scale3d(0.3, 0.3, 0.3)",
          transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        },
        "20%": {
          transform: "scale3d(1.1, 1.1, 1.1)",
        },
        "40%": {
          transform: "scale3d(0.9, 0.9, 0.9)",
        },
        "60%": {
          opacity: "1",
          transform: "scale3d(1.03, 1.03, 1.03)",
        },
        "80%": {
          transform: "scale3d(0.97, 0.97, 0.97)",
        },
        "100%": {
          opacity: "1",
          transform: "scale3d(1, 1, 1)",
        },
      },
    },
    animation: {
      "browse-in": "browse-in 0.4s ease-in-out 0.25s 1",
      "browse-out": "browse-out 0.4s ease-in-out 0.25s 1",
      flyin: "fly-in 0.6s ease-in-out 0.25s 1",
      flyout: "fly-out 0.6s ease-in-out 0.25s 1",
    },
  },
  plugins: [],
};
