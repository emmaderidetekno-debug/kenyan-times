import * as BABYLON from "@babylonjs/core";
import "./style.css";

const canvas = document.querySelector("#renderCanvas");
const loading = document.querySelector("#loading");
const prompt = document.querySelector("#interaction-prompt");
const toast = document.querySelector("#toast");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: false,
  stencil: true,
  antialias: true,
  adaptToDeviceRatio: true
});
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0.60, 0.78, 0.88, 1);
scene.collisionsEnabled = true;

const makeMaterial = (name, color, roughness = 1) => {
  const material = new BABYLON.StandardMaterial(name, scene);
  material.diffuseColor = BABYLON.Color3.FromHexString(color);
  material.specularColor = new BABYLON.Color3(0.08, 0.08, 0.08);
  return material;
};

const grassMat = makeMaterial("grass", "#739b59");
const pathMat = makeMaterial("campus paths", "#c9b994");
const wallMat = makeMaterial("warm campus walls", "#e4d5b8");
const roofMat = makeMaterial("deep green roofs", "#315b4b");
const windowMat = makeMaterial("blue windows", "#8eb9c6");
const trunkMat = makeMaterial("tree trunks", "#72503a");
const leafMat = makeMaterial("tree leaves", "#397b4e");
const playerMat = makeMaterial("player blue shirt", "#2878d4");
const skinMat = makeMaterial("player skin", "#8e5c3d");
const darkMat = makeMaterial("player trousers", "#263748");

const light = new BABYLON.HemisphericLight("sky light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.95;
const sun = new BABYLON.DirectionalLight("afternoon sun", new BABYLON.Vector3(-0.4, -1, 0.25), scene);
sun.position = new BABYLON.Vector3(20, 35, -10);
sun.intensity = 0.65;

const ground = BABYLON.MeshBuilder.CreateGround("campus lawn", { width: 100, height: 100 }, scene);
ground.material = grassMat;
ground.checkCollisions = true;

function box(name, x, y, z, width, height, depth, material, collide = true) {
  const mesh = BABYLON.MeshBuilder.CreateBox(name, { width, height, depth }, scene);
  mesh.position.set(x, y, z);
  mesh.material = material;
  mesh.checkCollisions = collide;
  return mesh;
}

function createBuilding(name, x, z, width, depth, height, signText) {
  const body = box(name, x, height / 2, z, width, height, depth, wallMat);
  body.metadata = { interactable: true, title: signText || name, message: `Welcome to ${signText || name}. More activities will be added in a future update.` };
  box(`${name} roof`, x, height + 0.18, z, width + 0.5, 0.36, depth + 0.5, roofMat, false);
  box(`${name} entrance`, x, 1.1, z - depth / 2 - 0.025, 1.35, 2.2, 0.12, roofMat, false);
  for (let side = -1; side <= 1; side += 2) {
    box(`${name} window ${side}`, x + side * width * 0.28, height * 0.62, z - depth / 2 - 0.04, 1.25, 1.05, 0.08, windowMat, false);
  }
  return body;
}

function createTree(x, z, scale = 1) {
  const trunk = BABYLON.MeshBuilder.CreateCylinder("tree trunk", { height: 2.1 * scale, diameter: 0.34 * scale }, scene);
  trunk.position.set(x, 1.05 * scale, z);
  trunk.material = trunkMat;
  trunk.checkCollisions = true;
  const crown = BABYLON.MeshBuilder.CreateSphere("tree crown", { diameter: 2.3 * scale, segments: 8 }, scene);
  crown.position.set(x, 2.45 * scale, z);
  crown.material = leafMat;
}

function createLamp(x, z) {
  const pole = BABYLON.MeshBuilder.CreateCylinder("path lamp pole", { height: 3.2, diameter: 0.12 }, scene);
  pole.position.set(x, 1.6, z);
  pole.material = roofMat;
  const lamp = BABYLON.MeshBuilder.CreateSphere("lamp", { diameter: 0.38 }, scene);
  lamp.position.set(x, 3.25, z);
  lamp.material = makeMaterial("lamp glow " + x + "-" + z, "#f8e7a0");
}

function createSign(text, x, z, width = 7) {
  const sign = box("campus sign", x, 2.1, z, width, 1.1, 0.18, roofMat, false);
  sign.metadata = { interactable: true, title: text, message: `${text}: this campus space is part of your new life. More activities are coming soon.` };
  return sign;
}

// Campus walkways and courtyard
box("main walkway", 0, 0.025, 0, 7, 0.05, 58, pathMat, false);
box("cross walkway", 0, 0.03, 1, 48, 0.06, 5, pathMat, false);
box("library approach", 0, 0.035, 15, 15, 0.07, 5, pathMat, false);
box("hostel approach", 14, 0.035, 8, 5, 0.07, 16, pathMat, false);

// Buildings
createBuilding("library", 0, 23, 14, 8, 6, "Campus Library");
createBuilding("cafeteria", -16, 7, 9, 8, 4.5, "Student Cafeteria");
createBuilding("hostel", 16, 17, 10, 9, 7, "Student Hostel");
createBuilding("student centre", -19, -12, 10, 8, 4.5, "Student Centre");
createBuilding("lecture hall", 17, -13, 13, 10, 5.5, "Lecture Hall");
createSign("KARIBU CAMPUS", 0, -23, 9);

// Trees and lamps
[
  [-8, 13], [-9, 19], [9, 13], [10, 20], [-24, 7], [-25, 13],
  [24, 8], [25, 14], [-9, -8], [9, -8], [-27, -16], [27, -18],
  [-13, 28], [13, 29], [-28, 24], [29, 25], [-30, -4], [31, 0],
  [-6, -22], [7, -25], [-25, -25], [26, -27]
].forEach(([x, z], i) => createTree(x, z, i % 3 === 0 ? 1.15 : 0.9));
[-14, -7, 7, 14].forEach((x) => createLamp(x, -1));

// Player placeholder: body, head and legs grouped under a root
const player = new BABYLON.TransformNode("player root", scene);
const body = BABYLON.MeshBuilder.CreateCapsule("player body", { height: 1.25, radius: 0.34 }, scene);
body.parent = player;
body.position.y = 1.05;
body.material = playerMat;
body.checkCollisions = false;
const head = BABYLON.MeshBuilder.CreateSphere("player head", { diameter: 0.52, segments: 12 }, scene);
head.parent = player;
head.position.y = 1.92;
head.material = skinMat;
const leftLeg = box("left leg", -0.16, 0.38, 0, 0.2, 0.65, 0.25, darkMat, false);
leftLeg.parent = player;
leftLeg.position.set(-0.16, 0.38, 0);
const rightLeg = box("right leg", 0.16, 0.38, 0, 0.2, 0.65, 0.25, darkMat, false);
rightLeg.parent = player;
rightLeg.position.set(0.16, 0.38, 0);
player.position.set(0, 0, -13);
player.rotationQuaternion = BABYLON.Quaternion.Identity();

// Third-person orbit camera
const camera = new BABYLON.ArcRotateCamera(
  "third person camera",
  -Math.PI / 2,
  1.18,
  7.5,
  new BABYLON.Vector3(0, 1.3, -13),
  scene
);
camera.lowerRadiusLimit = 4.5;
camera.upperRadiusLimit = 11;
camera.lowerBetaLimit = 0.65;
camera.upperBetaLimit = 1.45;
camera.panningSensibility = 0;
camera.wheelPrecision = 45;
camera.attachControl(canvas, true);
camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
camera.inertia = 0.75;

const keys = new Set();
let nearbyTarget = null;
let toastTimer = null;
let walkTime = 0;
const speed = 5.2;

function showToast(title, message) {
  toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3500);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
    event.preventDefault();
  }
  keys.add(key);
  if (key === "e" && nearbyTarget) {
    const data = nearbyTarget.metadata;
    if (data?.interactable) showToast(data.title, data.message);
  }
});
window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
window.addEventListener("blur", () => keys.clear());

const interactables = scene.meshes.filter((mesh) => mesh.metadata?.interactable);

scene.onBeforeRenderObservable.add(() => {
  const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
  let forward = 0;
  let strafe = 0;
  if (keys.has("w") || keys.has("arrowup")) forward += 1;
  if (keys.has("s") || keys.has("arrowdown")) forward -= 1;
  if (keys.has("a") || keys.has("arrowleft")) strafe -= 1;
  if (keys.has("d") || keys.has("arrowright")) strafe += 1;

  const moving = forward !== 0 || strafe !== 0;
  if (moving) {
    const direction = new BABYLON.Vector3(strafe, 0, forward);
    direction.normalize();
    const cameraForward = new BABYLON.Vector3(
      Math.sin(camera.alpha), 0, Math.cos(camera.alpha)
    );
    const cameraRight = new BABYLON.Vector3(cameraForward.z, 0, -cameraForward.x);
    const move = cameraRight.scale(direction.x).add(cameraForward.scale(direction.z));
    move.normalize();

    player.position.addInPlace(move.scale(speed * dt));
    player.position.x = BABYLON.Scalar.Clamp(player.position.x, -43, 43);
    player.position.z = BABYLON.Scalar.Clamp(player.position.z, -43, 43);
    player.rotation.y = Math.atan2(move.x, move.z);
    walkTime += dt * 10;
    leftLeg.rotation.x = Math.sin(walkTime) * 0.55;
    rightLeg.rotation.x = -Math.sin(walkTime) * 0.55;
  } else {
    leftLeg.rotation.x *= 0.8;
    rightLeg.rotation.x *= 0.8;
  }

  camera.target.copyFrom(player.position);
  camera.target.y += 1.25;

  let nearest = null;
  let nearestDistance = 4.2;
  for (const mesh of interactables) {
    const distance = BABYLON.Vector3.Distance(
      new BABYLON.Vector3(player.position.x, 0, player.position.z),
      new BABYLON.Vector3(mesh.position.x, 0, mesh.position.z)
    );
    if (distance < nearestDistance) {
      nearest = mesh;
      nearestDistance = distance;
    }
  }
  nearbyTarget = nearest;
  prompt.hidden = !nearest;
});

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
scene.executeWhenReady(() => {
  loading.classList.add("fade-out");
  setTimeout(() => loading.remove(), 700);
});
