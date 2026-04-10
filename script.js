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
let m = 1;
let h0 = 10;

let y, v, t;

let running = false;
let paused = false;

// jejak lintasan
let trail = [];

// load image
const ballImg = new Image();
ballImg.src = "ball.png";

// =====================
// SLIDER
// =====================
const heightSlider = document.getElementById("heightSlider");
const hValue = document.getElementById("hValue");

heightSlider.oninput = function () {
  h0 = parseFloat(this.value);
  hValue.innerText = h0;
  resetSim();
};

const massSlider = document.getElementById("massSlider");
const mValue = document.getElementById("mValue");

massSlider.oninput = function () {
  m = parseFloat(this.value);
  mValue.innerText = m;
  updateOutput();
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
  trail = [];
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

  // simpan jejak lintasan
  trail.push(y);

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

  let scale = (H - 40) / h0;

  // ====== GARIS LINTASAN (PUTUS-PUTUS) ======
  ctx.setLineDash([5, 5]);
  ctx.beginPath();

  trail.forEach((yy, i) => {
    let yPixel = H - 20 - yy * scale;
    if (i === 0) {
      ctx.moveTo(W / 2, yPixel);
    } else {
      ctx.lineTo(W / 2, yPixel);
    }
  });

  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);

  // posisi bola
  let yPixel = H - 20 - y * scale;

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
