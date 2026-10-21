# Kenya Life — Prototype 0.1

A 3D browser-based social life simulator prototype inspired by Kenyan campus life.

## Current prototype

- Babylon.js 3D scene with a fictional campus district
- Third-person orbit camera
- WASD / arrow-key movement
- Simple placeholder player character
- Campus library, cafeteria, hostel, student centre and lecture hall
- Interactable campus locations with an on-screen prompt
- Responsive HUD for desktop and mobile-sized screens

> This is an early single-player prototype. Multiplayer, accounts, character customization, animated character assets, collision-aware player movement, touch controls and persistent saves are not implemented yet.

## Requirements

- Node.js LTS
- npm
- A modern desktop browser with WebGL support

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Controls

- **W / A / S / D** or arrow keys: move
- **Drag with mouse**: rotate the camera
- **E**: interact when the prompt appears

## Project structure

```text
kenya-life/
├── index.html
├── package.json
├── src/
│   ├── main.js
│   └── style.css
└── .gitignore
```

## Roadmap

1. Verify and polish the first playable scene
2. Improve character controller, collisions and mobile controls
3. Add an animated 3D avatar and customization
4. Add campus activities, roleplay and NPCs
5. Build secure accounts and saved progress
6. Add multiplayer, friends, chat and moderation
7. Test performance and run a closed beta
8. Deploy a public release and expand based on player feedback

## Development note

Kenya Life is a working title. The first world is fictional and intended to capture a Kenyan campus atmosphere without representing any specific institution.

Built incrementally with JavaScript, Babylon.js and Vite.
