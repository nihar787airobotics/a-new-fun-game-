<div align="center">
https://v0-game-of-colour-e3ey1rk0n-nihar787airobotics-projects.vercel.app/

```
██████╗ ██╗      █████╗ ██╗   ██╗     ██╗
██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝    ██╔╝
██████╔╝██║     ███████║ ╚████╔╝    ██╔╝ 
██╔═══╝ ██║     ██╔══██║  ╚██╔╝    ██╔╝  
██║     ███████╗██║  ██║   ██║    ██╔╝   
╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝    
    &  ██████╗ ██████╗  █████╗ ██╗    ██╗
       ██╔══██╗██╔══██╗██╔══██╗██║    ██║
       ██║  ██║██████╔╝███████║██║ █╗ ██║
       ██║  ██║██╔══██╗██╔══██║██║███╗██║
       ██████╔╝██║  ██║██║  ██║╚███╔███╔╝
       ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ 3D
```

<br />

**✦ Hand-Tracking Powered ✦ No Controllers ✦ No Install ✦**

<br />

[![Made with Love](https://img.shields.io/badge/made%20with-love%20%26%20curiosity-ff6b35?style=for-the-badge&labelColor=0d0d0d)](/)
[![Learning Project](https://img.shields.io/badge/type-learning%20project-00bcd4?style=for-the-badge&labelColor=0d0d0d)](/)
[![MediaPipe](https://img.shields.io/badge/powered%20by-mediapipe-ffd166?style=for-the-badge&labelColor=0d0d0d)](https://mediapipe.dev)
[![Status](https://img.shields.io/badge/status-experimenting-a8ff78?style=for-the-badge&labelColor=0d0d0d)](/)

<br />

> *"This started as a weekend experiment. It turned into something I'm genuinely proud of."*

<br />

</div>

---

<br />

## 〔 What is this? 〕

**Play & Draw 3D** is a browser-based hand-tracking canvas where your webcam becomes a creative tool. Open your hand to summon elemental effects — fire, ice, lightning — or pinch your fingers together to paint with particles.

> ⚠️ **Heads up** — This is a **learning & experimentation project**. It's not polished software or a production app. It's a playground I built to understand hand tracking, particle systems, and real-time browser APIs. Expect rough edges, weird bugs, and plenty of "why does this work?" moments.

<br />

---

<br />

## 〔 The Stack 〕

```
Browser API  ──────────►  MediaPipe Hands
                               │
                               ▼
                        Hand Landmark Data
                         (21 points / hand)
                               │
                               ▼
                    Gesture Classification
                    (open / pinch / closed)
                               │
                               ▼
                      Particle System (Canvas 2D)
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
              Fire & Ice ❄🔥        Lightning ⚡
              Red & Blue 🔴🔵      Draw Mode ✍️
```

- **MediaPipe Hands** — Real-time hand landmark detection
- **Canvas 2D API** — Custom particle renderer
- **Vanilla JS / HTML** — No framework, just the browser
- **Webcam API** — `getUserMedia()` for live camera feed

<br />

---

<br />

## 〔 Features 〕

| Feature | Description |
|---|---|
| 🤚 **Hand Tracking** | Real-time detection using MediaPipe — up to 2 hands simultaneously |
| 🔥 **Fire & Ice Mode** | Left hand summons fire, right hand conjures ice particles |
| ⚡ **Lightning Mode** | Open both hands to call down lightning bolts |
| ✍️ **Pinch to Draw** | Touch thumb + index finger to paint persistent particle trails |
| 🌊 **Depth Effects** | Z-axis simulation for 3D-feeling particle movement |
| 📷 **Live Camera** | Your face/hands appear live in the background |
| 🎯 **60 FPS Target** | Optimized render loop for smooth performance |

<br />

---

<br />

## 〔 How to Play 〕

### Power Modes
Press a key to switch between modes:

```
  1  ──►  🔥❄️  Fire & Ice    (left = fire, right = ice)
  2  ──►  ⚡    Lightning     (both hands open = bolts)
  3  ──►  🔴🔵  Red & Blue    (colored particles)
```

### Hand Gestures

```
  ✋ Open Hand  ──►  Activate power, build intensity
  🤌 Pinch     ──►  Paint with elemental particles (persists on screen)
  ✊ Fist      ──►  Deactivate / rest
```

<br />

---

<br />

## 〔 Running Locally 〕

No build step. No npm install. Just open it.

```bash
# Clone the repo
git clone https://github.com/yourusername/play-and-draw-3d.git

# Navigate into it
cd play-and-draw-3d

# Serve it locally (browser requires HTTPS or localhost for webcam)
npx serve .
# or
python -m http.server 8080

# Open in browser
http://localhost:8080
```

> 💡 **Why a local server?** Browsers block webcam access on `file://` URLs for security reasons. You need `localhost` or `https://`.

<br />

---

<br />

## 〔 What I Learned 〕

This project was built to explore and understand:

- **`getUserMedia()` API** — accessing webcam streams in the browser
- **MediaPipe integration** — loading ML models client-side, processing video frames
- **Particle systems** — position, velocity, decay, color interpolation
- **Canvas performance** — `requestAnimationFrame`, partial clears, layered canvases
- **Gesture recognition** — converting raw landmark coordinates into meaningful actions
- **Real-time rendering** — keeping frame rates high while running ML inference

<br />

---

<br />

## 〔 Known Quirks & Rough Edges 〕

Because it's a learning project, some things are intentionally unfinished:

- 🐌 Performance drops on older/slower machines
- 🌑 Low lighting ruins hand detection (MediaPipe needs decent light)
- 📱 Mobile is not supported (desktop webcam only)
- 🔀 Particle physics are hand-tuned, not physically accurate
- 🎨 Drawing doesn't save or export — it's ephemeral

*These aren't really bugs. They're just... the texture of learning.*

<br />

---

<br />

## 〔 What's Next (maybe) 〕

These are ideas, not promises:

- [ ] Save/export drawings as PNG
- [ ] More elemental modes (water, earth, wind)
- [ ] Two-player mode over WebRTC
- [ ] Mobile touch fallback
- [ ] Sound effects tied to gestures
- [ ] 3D canvas with WebGL particles

<br />

---

<br />

<div align="center">

**〔 Built for learning. Shared for fun. 〕**

<br />

*If you find this useful, weird, or broken in an interesting way —*
*open an issue, fork it, break it further.*

<br />

```
  ✦  This is not a product. It's a proof of curiosity.  ✦
```

<br />



</div>
