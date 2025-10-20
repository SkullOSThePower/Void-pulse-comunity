/* -------------------------
  Pointer moves along circle and points to cursor
------------------------- */
const core = document.getElementById('core');
const pointer = document.getElementById('pointer');

// smoothing state
let currentAngle = -Math.PI/2; // start at top
let targetAngle = currentAngle;
const lerp = 0.16; // smoothing

function clampAngle(a){
  while(a > Math.PI) a -= Math.PI*2;
  while(a < -Math.PI) a += Math.PI*2;
  return a;
}

function updateTargetFromClient(x, y){
  const rect = core.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const angle = Math.atan2(y - cy, x - cx);
  targetAngle = angle;
}

function setPointerByAngle(angle){
  const rect = core.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const radius = Math.min(rect.width, rect.height) / 2 - 14; // margin
  const px = cx + Math.cos(angle) * radius;
  const py = cy + Math.sin(angle) * radius;
  pointer.style.left = (px - rect.left) + 'px';
  pointer.style.top  = (py - rect.top) + 'px';
  const deg = angle * 180 / Math.PI;
  const arrow = pointer.querySelector('.arrow');
  if(arrow) arrow.style.transform = `rotate(${deg+90}deg)`;
}

// smoothing animation loop
function animate(){
  let diff = clampAngle(targetAngle - currentAngle);
  currentAngle += diff * lerp;
  setPointerByAngle(currentAngle);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// input handlers
function handleMouseMove(e){
  updateTargetFromClient(e.clientX, e.clientY);
  resetIdleTimer();
}
function handleTouchMove(e){
  if(!e.touches || !e.touches[0]) return;
  const t = e.touches[0];
  updateTargetFromClient(t.clientX, t.clientY);
  resetIdleTimer();
}

// init pointer position
(function initPointerAtTop(){
  setPointerByAngle(currentAngle);
})();

window.addEventListener('mousemove', handleMouseMove, {passive:true});
window.addEventListener('touchmove', handleTouchMove, {passive:true});

/* -------------------------
  Staggered button intro
------------------------- */
const btns = Array.from(document.querySelectorAll('.actions .btn, .actions a.btn'));
function showButtonsStagger(){
  btns.forEach((b,i)=>{
    setTimeout(()=> b.classList.add('show'), i * 140);
  });
}
setTimeout(showButtonsStagger, 420);

/* -------------------------
  Panel open/close and stagger links
------------------------- */
const openPanelBtn = document.getElementById('openPanel');
const closePanelBtn = document.getElementById('closePanel');
const panel = document.getElementById('panel');
const panelLinks = Array.from(document.querySelectorAll('.p-link'));

openPanelBtn.addEventListener('click', ()=>{
  panel.classList.add('open');
  panel.setAttribute('aria-hidden','false');
  panelLinks.forEach((ln, i) => {
    setTimeout(()=> ln.classList.add('show'), 120 * i);
  });
});
closePanelBtn.addEventListener('click', ()=>{
  panelLinks.forEach((ln,i)=>{
    ln.classList.remove('show');
  });
  setTimeout(()=> {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
  }, 220);
});

/* -------------------------
  Info button (example)
------------------------- */
const infoBtn = document.getElementById('infoBtn');
infoBtn.addEventListener('click', ()=> {
  showToast('Pre-alpha build — features in progress');
});

/* -------------------------
  Join button already is an anchor -> opens discord in new tab
------------------------- */

/* -------------------------
  Toast helper
------------------------- */
const toast = document.getElementById('toast');
function showToast(msg, ms=1500){
  toast.textContent = msg;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  setTimeout(()=> {
    toast.style.opacity = '0';
    setTimeout(()=> toast.style.display = 'none', 420);
  }, ms);
}

/* -------------------------
  Idle small orbit while idle
------------------------- */
let idleTimer = 0;
let idle = false;
function resetIdleTimer(){
  idle = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(()=> { idle = true; }, 3500);
}
resetIdleTimer();
window.addEventListener('mousemove', resetIdleTimer, {passive:true});
window.addEventListener('touchstart', resetIdleTimer, {passive:true});

setInterval(()=>{
  if(idle){
    // slow automatic orbit
    targetAngle += 0.01;
  }
}, 120);

/* -------------------------
  On resize reposition pointer
------------------------- */
window.addEventListener('resize', ()=> {
  setPointerByAngle(currentAngle);
});

/* end of script */
