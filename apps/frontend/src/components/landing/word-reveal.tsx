export function WordReveal({ children }: { children: string }) {
    return (
      <span
        style={{
          display: "inline-block",
          overflow: "hidden",
          verticalAlign: "bottom",
        }}
      >
        <span className="gsap-reveal-word inline-block">{children}</span>
      </span>
    );
  }