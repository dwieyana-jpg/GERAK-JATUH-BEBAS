const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W, H;

function resizeCanvas() {
  W = canvas.clientWidth;
  H = canvas.clientHeight;
  canvas.width = W;
  canvas.height = H;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// =====================
// PARAMETER FISIKA
// =====================
const g = 9.8;
const m = 1;

let h0 = 10;
let y, v, t;

let running = false;
let paused = false;

// load image
const ballImg = new Image();
ballImg.src = "ball.png";

// =====================
// SLIDER
// =====================
const slider = document.getElementById("heightSlider");
const hValue = document.getElementById("hValue");

slider.oninput = function () {
  h0 = parseFloat(this.value);
  hValue.innerText = h0;
  resetSim();
};

// =====================
// SIMULASI
// =====================
function startSim() {
  running = true;
  paused = false;
}

function pauseSim() {
  if (!running) return;
  paused = !paused;
}

function resetSim() {
  running = false;
  paused = false;
  t = 0;
  v = 0;
  y = h0;
  draw();
  updateOutput();
}

// =====================
// UPDATE FISIKA
// =====================
function update(dt) {
  if (!running || paused) return;

  t += dt;
  v = g * t;
  y = h0 - 0.5 * g * t * t;

  if (y <= 0) {
    y = 0;
    running = false;
  }

  updateOutput();
}

// =====================
// OUTPUT
// =====================
function updateOutput() {
  let ep = m * g * y;
  let ek = 0.5 * m * v * v;
  let em = ep + ek;

  document.getElementById("h").innerText = y.toFixed(2);
  document.getElementById("v").innerText = v.toFixed(2);
  document.getElementById("ep").innerText = ep.toFixed(2);
  document.getElementById("ek").innerText = ek.toFixed(2);
  document.getElementById("em").innerText = em.toFixed(2);
}

// =====================
// GAMBAR
// =====================
function draw() {
  ctx.clearRect(0, 0, W, H);

  // tanah
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(0, H - 20, W, 20);

  // konversi skala
  let scale = (H - 40) / h0;
  let yPixel = H - 20 - y * scale;

  // bola
  ctx.drawImage(ballImg, W / 2 - 20, yPixel - 20, 40, 40);
}

// =====================
// LOOP
// =====================
let lastTime = 0;

function animate(time) {
  let dt = (time - lastTime) / 1000;
  lastTime = time;

  update(dt);
  draw();

  requestAnimationFrame(animate);
}

resetSim();
requestAnimationFrame(animate);