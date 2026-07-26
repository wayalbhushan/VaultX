import { useEffect, useRef } from "react";

export default function MatrixBackground({ opacity = 0.04, speed = 50 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const chars = "0123456789ABCDEFHIJKLMNOPQRSTUVWXYZ_$%#@&*";
    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let lastTime = 0;
    const draw = (time) => {
      if (time - lastTime > speed) {
        lastTime = time;

        ctx.fillStyle = `rgba(5, 8, 17, ${opacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

        drops.forEach((y, index) => {
          const char = chars.charAt(Math.floor(Math.random() * chars.length));
          const isLeadingChar = Math.random() > 0.85;

          ctx.fillStyle = isLeadingChar ? "#67e8f9" : "#10b981";
          ctx.fillText(char, index * fontSize, y * fontSize);

          if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[index] = 0;
          }
          drops[index]++;
        });
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-1000"
    />
  );
}
