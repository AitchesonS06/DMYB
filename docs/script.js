// Damn Marto, You Buggin — interactions
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- Nav: scrolled state + mobile menu ----------
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.getElementById("nav-links");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    links.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  // ---------- Terminal typing ----------
  const typed = document.querySelector(".typed");
  const lines = typed.dataset.lines.split("|");

  if (reduceMotion) {
    typed.textContent = lines.join("\n");
  } else {
    let line = 0, char = 0, deleting = false;
    const tick = () => {
      const current = lines[line];
      typed.textContent = current.slice(0, char);
      if (!deleting && char < current.length) { char++; setTimeout(tick, 55); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
      else if (char > 0) { char--; setTimeout(tick, 25); }
      else { deleting = false; line = (line + 1) % lines.length; setTimeout(tick, 300); }
    };
    setTimeout(tick, 600);
  }

  // ---------- Glitch title every few seconds ----------
  const glitch = document.querySelector(".glitch");
  if (!reduceMotion) {
    const fire = () => {
      glitch.classList.add("is-glitching");
      setTimeout(() => glitch.classList.remove("is-glitching"), 350);
    };
    glitch.addEventListener("mouseenter", fire);
    setInterval(fire, 4500);
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // ---------- Card spotlight follows cursor ----------
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // ---------- Hero waveform (canvas) ----------
  const canvas = document.querySelector(".hero__wave");
  const ctx = canvas.getContext("2d");
  const styles = getComputedStyle(document.documentElement);
  const green = styles.getPropertyValue("--accent").trim();
  const hot = styles.getPropertyValue("--hot").trim();
  let w, h, dpr, t = 0, mouseY = 0.5, running = true;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const wave = (color, amp, freq, speed, offset, width) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    for (let x = 0; x <= w; x += 4) {
      const n = x / w;
      const envelope = Math.sin(n * Math.PI);  // taper at edges
      const y = h * 0.62
        + Math.sin(n * freq + t * speed + offset) * amp * envelope
        + Math.sin(n * freq * 2.3 + t * speed * 1.7) * amp * 0.35 * envelope;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const amp = h * (0.06 + mouseY * 0.08);
    ctx.globalAlpha = 0.9; wave(green, amp, 9, 0.9, 0, 1.5);
    ctx.globalAlpha = 0.5; wave(hot, amp * 0.8, 12, 1.2, 2, 1.2);
    ctx.globalAlpha = 0.25; wave(green, amp * 1.3, 6, 0.6, 4, 1);
    ctx.globalAlpha = 1;
  };

  const loop = () => {
    if (!running) return;
    t += 0.016;
    draw();
    requestAnimationFrame(loop);
  };

  resize();
  window.addEventListener("resize", () => { resize(); if (reduceMotion) draw(); });
  window.addEventListener("pointermove", (e) => { mouseY = e.clientY / window.innerHeight; }, { passive: true });

  if (reduceMotion) {
    draw();
  } else {
    // pause animation when hero is off-screen
    new IntersectionObserver(([entry]) => {
      const wasRunning = running;
      running = entry.isIntersecting;
      if (running && !wasRunning) loop();
    }).observe(canvas);
    loop();
  }
})();
