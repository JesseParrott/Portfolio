const canvas = document.getElementById('nodeCanvas');
const ctx = canvas.getContext('2d');

let w, h;
let nodes = [];
let mouse = { x: null, y: null, radius: 100 }; 
// radius: how close we must be for lines to form with mouse node

const NODE_COUNT = 80;
const MAX_DIST = 150; 
// Max distance to draw a line between two nodes or a node and the mouse

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse position
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Reset mouse position if it leaves canvas area
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

// Create nodes
function initNodes() {
  nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 2
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  // Draw lines between nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let dist = distance(nodes[i], nodes[j]);
      if (dist < MAX_DIST) {
        let opacity = 1 - dist / MAX_DIST;
        ctx.strokeStyle = `rgba(255, 81, 0,${opacity})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // Draw line from mouse to node if close
    if (mouse.x !== null && mouse.y !== null) {
      let mDist = distance(mouse, nodes[i]);
      if (mDist < mouse.radius) {
        let opacity = 1 - mDist / mouse.radius;
        ctx.strokeStyle = `rgba(255, 81, 0,${opacity})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  for (let node of nodes) {
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fill();
  }

  updateNodes();

  requestAnimationFrame(draw);
}

// Move nodes and keep them within the canvas bounds
function updateNodes() {
  for (let node of nodes) {
    node.x += node.vx;
    node.y += node.vy;

    // Bounce off edges
    if (node.x < 0 || node.x > w) node.vx *= -1;
    if (node.y < 0 || node.y > h) node.vy *= -1;
  }
}

function distance(p1, p2) {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

initNodes();
draw();
