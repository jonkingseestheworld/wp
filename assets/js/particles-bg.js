// Particle-network background for the home page.
// Adapted from https://github.com/adam-tuoa/homepage (script.js).
// Expects <canvas id="particle-canvas"> inside a fixed container at the top-left of the viewport,
// so clientX/clientY from the mouse can be used directly as canvas coordinates.
(function () {
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var html = document.documentElement;

  // ---- Tweakables ----------------------------------------------------------
  var PARTICLE_COUNT = 30;
  var SPEED = 0.15;              // initial velocity; lower = slower drift
  var LINK_DISTANCE = 280;       // max length of a line between same-colour particles
  var LINK_OPACITY = 0.2;       // opacity of those lines (at zero distance)
  var CURSOR_RADIUS = 150;       // cursor pulls and lights up particles within this distance
  var REPEL_TEXT = false;        // true = push particles out of the .home block (leaves only the side margins)
  var TEXT_PADDING = 40;         // padding around .home when REPEL_TEXT is on
  var DARK_BOOST = 1.5;          // multiplies all opacities in dark mode
  var LIGHT_BOOST = 2.5;         // ...and in light mode (faint lines vanish on white)
  var HOVER_FADE_SPEED = 0.02;   // profile picture hover fade; lower = slower

  // Palette (assets/css/main.scss), as [r, g, b]. Deeper tones in light mode so lines show on white.
  var PALETTES = {
    dark: [[252, 172, 137], [227, 129, 80], [142, 187, 167], [242, 221, 204], [185, 205, 203]],
    light: [[39, 99, 89], [142, 187, 167], [227, 129, 80], [252, 172, 137], [79, 117, 102]]
  };
  // --------------------------------------------------------------------------

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var alphaScale = 1;
  var particles = [];
  var mouseX = -9999, mouseY = -9999;
  var hoverTransition = 0, imageHovering = false, imageRect = null;
  var textEl = document.querySelector('.home');
  var imageEl = document.querySelector('.home .profilepic');

  function palette() {
    return html.classList.contains('dark-mode') ? PALETTES.dark : PALETTES.light;
  }
  function rgba(c, a) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.min(1, a * alphaScale) + ')';
  }

  function resize() {
    canvas.width = canvas.parentNode.clientWidth;
    canvas.height = canvas.parentNode.clientHeight;
  }

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * SPEED;
    this.vy = (Math.random() - 0.5) * SPEED;
    this.radius = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.3 + 0.1;
    this.colorIndex = Math.floor(Math.random() * PALETTES.dark.length);
  }

  Particle.prototype.update = function () {
    // gentle pull towards the cursor
    var dx = mouseX - this.x, dy = mouseY - this.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d < CURSOR_RADIUS && d > 0) {
      var f = (1 - d / CURSOR_RADIUS) * 0.02;
      this.vx += (dx / d) * f;
      this.vy += (dy / d) * f;
    }

    // push away from the text block so lines don't run through the copy
    if (REPEL_TEXT && textEl) {
      var r = textEl.getBoundingClientRect();
      if (this.x > r.left - TEXT_PADDING && this.x < r.right + TEXT_PADDING &&
          this.y > r.top - TEXT_PADDING && this.y < r.bottom + TEXT_PADDING) {
        var rx = this.x - (r.left + r.width / 2), ry = this.y - (r.top + r.height / 2);
        var rd = Math.sqrt(rx * rx + ry * ry);
        if (rd > 0) {
          this.vx += (rx / rd) * 0.15;
          this.vy += (ry / rd) * 0.15;
        }
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.94;
    this.vy *= 0.94;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    this.x = Math.max(0, Math.min(canvas.width, this.x));
    this.y = Math.max(0, Math.min(canvas.height, this.y));
  };

  function line(c, a, w, x1, y1, x2, y2) {
    ctx.strokeStyle = rgba(c, a);
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  function dot(c, a, x, y, r) {
    ctx.fillStyle = rgba(c, a);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // same-colour particles within LINK_DISTANCE are joined
  function drawLinks(pal) {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var p = particles[i], q = particles[j];
        if (p.colorIndex !== q.colorIndex) continue;
        var d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK_DISTANCE) line(pal[p.colorIndex], (1 - d / LINK_DISTANCE) * LINK_OPACITY, 1.2, p.x, p.y, q.x, q.y);
      }
    }
  }

  // near the cursor, particles also link across colours and glow
  function drawCursor(pal) {
    particles.forEach(function (p) {
      var dc = Math.hypot(p.x - mouseX, p.y - mouseY);
      if (dc >= CURSOR_RADIUS) return;
      var influence = 1 - dc / CURSOR_RADIUS;
      particles.forEach(function (q) {
        if (p === q) return;
        var d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK_DISTANCE) line(pal[p.colorIndex], influence * (1 - d / LINK_DISTANCE) * 0.2, 1.2, p.x, p.y, q.x, q.y);
      });
      dot(pal[p.colorIndex], influence * 0.6, p.x, p.y, p.radius + 2);
    });
  }

  // hovering the profile picture reaches lines out from its corners
  function drawImage(pal) {
    if (!hoverTransition || !imageRect) return;
    var R = 900, r = imageRect;
    var corners = [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom]];
    particles.forEach(function (p) {
      var closest = R;
      corners.forEach(function (c) {
        var d = Math.hypot(p.x - c[0], p.y - c[1]);
        closest = Math.min(closest, d);
        if (d < R && d > 50) line(pal[p.colorIndex], (1 - d / R) * 0.25 * hoverTransition, 1.5, c[0], c[1], p.x, p.y);
      });
      if (closest < R) dot(pal[p.colorIndex], (1 - closest / R) * 0.4 * hoverTransition, p.x, p.y, p.radius + 1.5);
    });
  }

  function frame() {
    var pal = palette();
    alphaScale = pal === PALETTES.dark ? DARK_BOOST : LIGHT_BOOST;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hoverTransition = imageHovering ? Math.min(1, hoverTransition + HOVER_FADE_SPEED)
                                    : Math.max(0, hoverTransition - HOVER_FADE_SPEED);
    particles.forEach(function (p) {
      p.update();
      dot(pal[p.colorIndex], p.opacity, p.x, p.y, p.radius);
    });
    drawLinks(pal);
    drawCursor(pal);
    drawImage(pal);
    if (!reducedMotion) requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; });
  document.addEventListener('mouseleave', function () { mouseX = mouseY = -9999; });

  if (imageEl) {
    imageEl.addEventListener('mouseenter', function () { imageHovering = true; imageRect = imageEl.getBoundingClientRect(); });
    imageEl.addEventListener('mouseleave', function () { imageHovering = false; });
    window.addEventListener('scroll', function () { if (imageHovering) imageRect = imageEl.getBoundingClientRect(); });
  }

  for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  frame();
})();
