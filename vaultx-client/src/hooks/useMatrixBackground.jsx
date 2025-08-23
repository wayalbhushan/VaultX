import { useEffect } from "react";

export function useMatrixBackground(
  canvasRef,
  { fontSize = 14, letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&" } = {}
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let columns = 0;
    const drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops.length = columns;
      for (let i = 0; i < columns; i++) {
        drops[i] = drops[i] || 1;
      }
    };

    const draw = () => {
      // translucent black overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix green text
      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const char = letters.charAt(
          Math.floor(Math.random() * letters.length)
        );
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, fontSize, letters]);
}