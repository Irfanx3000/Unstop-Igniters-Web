import React, { useEffect, useRef } from "react";

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let stars = [];
    const numStars = 200;
    const shootingInterval = 5000; // every 5 seconds approx

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2,
        speed: Math.random() * 0.05 + 0.02,
      });
    }

    // Shooting star
    const createShootingStar = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 2),
        length: Math.random() * 80 + 50,
        speed: Math.random() * 6 + 4,
        opacity: 1,
      };
    };

    let shootingStar = null;

    setInterval(() => {
      shootingStar = createShootingStar();
    }, shootingInterval);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.globalAlpha = Math.random() * 0.8 + 0.2; // twinkle
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
      });

      // Draw shooting star
      if (shootingStar) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.globalAlpha = shootingStar.opacity;

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.length,
          shootingStar.y + shootingStar.length / 2
        );
        ctx.stroke();

        shootingStar.x += shootingStar.speed * -1;
        shootingStar.y += shootingStar.speed * 0.5;
        shootingStar.opacity -= 0.02;

        if (shootingStar.opacity <= 0) shootingStar = null;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default Starfield;
