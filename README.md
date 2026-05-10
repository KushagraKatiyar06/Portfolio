# Kushagra Katiyar | Portfolio.v2

A personal portfolio website built inside an interactive 3D garage — featuring two real car models (Mazda RX-7 FD and Porsche Carrera GT), a cinematic camera system that pans between sections, and a fully animated sidebar with my work history, projects, and skills. The garage environment is modeled after Need for Speed 2015.

Live site: [kushagrakatiyar06.github.io/Portfolio-v2](https://kushagrakatiyar06.github.io/Portfolio-v2/)

---

## Tech Stack

**Frontend:** React 18, Vite
**3D:** Three.js, React Three Fiber, React Three Drei
**Models:** Custom .glb models (garage, RX-7 FD, Carrera GT)
**Deployment:** GitHub Actions → GitHub Pages

---

## Features

- Interactive 3D garage scene with two car models and dynamic lighting
- Cinematic camera that smoothly transitions between About, Experience, and Projects sections
- Animated sidebar with expandable content panels
- Keyboard navigation — arrow keys to cycle sections, Enter to open full portfolio view
- Responsive splash screen with intro animation
- Adaptive DPR for performance scaling

---

## Setup

```bash
git clone https://github.com/KushagraKatiyar06/Portfolio-v2.git
cd Portfolio-v2
npm install
npm run dev
```

Ensure the `models/` directory is present — it contains the `.glb` scene assets.

---

Developed by Kushagra Katiyar
