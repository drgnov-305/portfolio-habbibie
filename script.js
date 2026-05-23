/* ── Loading Screen ─────────────────────────────────────────── */
(function () {
  const screen  = document.getElementById('loading-screen');
  const bar     = document.getElementById('loading-bar');
  const percent = document.getElementById('loading-percent');
  const first   = document.querySelector('.loading-first');
  const last    = document.querySelector('.loading-last');
  const role    = document.querySelector('.loading-role');

  let progress = 0;
  const duration = 1000; // 1 detik
  const interval = 16;   // ~60fps
  const step = 100 / (duration / interval);

  // Fade in nama dan role dulu
  gsap.to([first, last], {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.12,
    ease: 'power2.out',
  });

  gsap.to([role, percent], {
    opacity: 1,
    duration: 0.4,
    delay: 0.3,
    ease: 'power2.out',
  });

  // Progress bar count up
  const timer = setInterval(() => {
    progress = Math.min(progress + step, 100);
    bar.style.width = progress + '%';
    percent.textContent = Math.round(progress) + '%';

    if (progress >= 100) {
      clearInterval(timer);

      // Setelah 100% — exit animation
      gsap.timeline({ delay: 0.15 })
        .to('.loading-content', {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.in'
        })
        .to(screen, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.6,
          ease: 'expo.inOut',
          onComplete: () => {
            screen.style.display = 'none';
          }
        });
    }
  }, interval);
})();

/* ── 3D Wave (Three.js) ─────────────────────────────────────── */
(function () {
  const container = document.getElementById('wave-container');
  const canvas    = document.getElementById('wave-canvas');
  if (!container || !canvas) return;

  // ── Scene setup ──
  const scene    = new THREE.Scene();
  const W        = container.clientWidth  || 400;
  const H        = container.clientHeight || 500;
  const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  camera.position.set(0, 2.5, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── Grid wave geometry ──
  const cols     = 48;
  const rows     = 48;
  const spacing  = 0.22;
  const geometry = new THREE.PlaneGeometry(
    cols * spacing,
    rows * spacing,
    cols - 1,
    rows - 1
  );
  geometry.rotateX(-Math.PI / 2.8);

  // Warna dari palette — ungu
  const material = new THREE.MeshBasicMaterial({
    color: 0x7c3aed,
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  });

  const wave = new THREE.Mesh(geometry, material);
  scene.add(wave);

  // Titik-titik di atas wireframe
  const pointGeo = new THREE.BufferGeometry();
  const positions = geometry.attributes.position.array.slice();
  pointGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const pointMat = new THREE.PointsMaterial({
    color: 0xa78bfa,
    size: 0.045,
    transparent: true,
    opacity: 0.7,
  });

  const points = new THREE.Points(pointGeo, pointMat);
  points.rotation.copy(wave.rotation);
  scene.add(points);

  // ── Mouse tracking ──
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize handler ──
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // ── Animate ──
  const posAttr   = geometry.attributes.position;
  const pointsPos = pointGeo.attributes.position;
  const clock     = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Wave deformation
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      // Kombinasi dua gelombang biar lebih natural
      const wave1 = Math.sin(x * 1.8 + t * 1.2) * 0.28;
      const wave2 = Math.sin(z * 1.4 + t * 0.9) * 0.22;
      const wave3 = Math.sin((x + z) * 1.1 + t * 0.7) * 0.15;

      const y = wave1 + wave2 + wave3;
      posAttr.setY(i, y);
      pointsPos.setY(i, y);
    }

    posAttr.needsUpdate   = true;
    pointsPos.needsUpdate = true;

    // Smooth cursor follow
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    wave.rotation.y   = targetX * 0.4;
    wave.rotation.z   = targetY * 0.15;
    points.rotation.y = targetX * 0.4;
    points.rotation.z = targetY * 0.15;

    // Auto subtle rotation
    wave.rotation.y   += Math.sin(t * 0.3) * 0.003;
    points.rotation.y += Math.sin(t * 0.3) * 0.003;

    renderer.render(scene, camera);
  }

  animate();

  // ── Dark/light mode color update ──
  const observer = new MutationObserver(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    material.color.set(isDark ? 0xa78bfa : 0x7c3aed);
    pointMat.color.set(isDark ? 0xc4b5fd : 0xa78bfa);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();



/* ── 1. Register GSAP Plugins ──────────────────────────────── */
gsap.registerPlugin(ScrollTrigger, TextPlugin);


/* ── 2. Page Enter Transition ──────────────────────────────── */
const overlay = document.getElementById('page-transition');

gsap.timeline()
  .set(overlay, { scaleY: 1, transformOrigin: 'top' })
  .to(overlay, { scaleY: 0, duration: 0.9, ease: 'expo.inOut', delay: 0.1 });


/* ── 3. Custom Cursor ──────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');

window.addEventListener('mousemove', e => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'none' });
  gsap.to(ring,   { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power2.out' });
});

document.querySelectorAll('a, button, .project-card, .skill-pill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { scale: 2.5, duration: 0.25 });
    gsap.to(ring,   { scale: 0.5, opacity: 0.4, duration: 0.25 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { scale: 1, duration: 0.25 });
    gsap.to(ring,   { scale: 1, opacity: 1, duration: 0.25 });
  });
});


/* ── 4. Navbar Scroll State ────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ── 5. Hero Entrance Animation ────────────────────────────── */

// Setup typing cursor
const nameLine1 = document.querySelector('.hero-name .line:nth-child(1) span');
const nameLine2 = document.querySelector('.hero-name .line:nth-child(2) span');
const fullName1 = 'Habbibie';
const fullName2 = 'Zikrillah.';

// Kosongkan dulu sebelum animasi
nameLine1.textContent = '';
nameLine2.textContent = '';

// Fungsi typing manual (tanpa TextPlugin) — lebih reliable
function typeText(el, text, onComplete) {
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      el.classList.add('done'); // cursor hilang
      if (onComplete) onComplete();
    }
  }, 80); // kecepatan per karakter — makin kecil makin cepat
}

const heroTL = gsap.timeline({ delay: 0.7 });

heroTL
  // Tag kecil fade in
  .to('.hero-tag', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  })
  // Baris pertama slide up dulu, baru typing
  .to(nameLine1, {
    y: 0,
    duration: 0.6,
    ease: 'expo.out',
    onComplete: () => {
      typeText(nameLine1, fullName1, () => {
        // Setelah baris 1 selesai, mulai baris 2
        gsap.to(nameLine2, {
          y: 0,
          duration: 0.5,
          ease: 'expo.out',
          onComplete: () => {
            typeText(nameLine2, fullName2);
          }
        });
      });
    }
  })
  // Desc dan CTA muncul setelah jeda
  .to('.hero-desc', {
    opacity: 1,
    duration: 0.7,
    ease: 'power2.out',
    delay: (fullName1.length + fullName2.length) * 0.08 + 0.3
  })
  .to('.hero-cta', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4')
  .to('.scroll-indicator', {
    opacity: 1,
    duration: 0.6
  }, '-=0.2');

/* ── 6. Scroll Reveal ──────────────────────────────────────── */
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none'
    }
  });
});


/* ── 7. Project Cards Stagger ──────────────────────────────── */
gsap.fromTo('.project-card',
  { opacity: 0, x: -24 },
  {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: '.project-grid',
      start: 'top 80%'
    }
  }
);


/* ── 8. Skill Pills Stagger ────────────────────────────────── */
gsap.fromTo('.skill-pill',
  { opacity: 0, scale: 0.88 },
  {
    opacity: 1,
    scale: 1,
    duration: 0.45,
    ease: 'back.out(1.4)',
    stagger: 0.04,
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 75%'
    }
  }
);


/* ── 9. Contact Heading Char Split ─────────────────────────── */
const contactH = document.querySelector('.contact-heading');
if (contactH) {
  contactH.innerHTML = contactH.innerHTML.replace(/(\S)/g, '<span class="ch">$1</span>');

  gsap.fromTo('.contact-heading .ch',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.025,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%'
      }
    }
  );
}


/* ── 10. Stat Count-Up ─────────────────────────────────────── */
gsap.utils.toArray('.stat-num').forEach(el => {
  const raw     = el.textContent.trim();
  const num     = parseFloat(raw.replace(/[^0-9.]/g, ''));
  const suffix  = raw.replace(/[0-9.]/g, '');
  const isFloat = raw.includes('.');
  const obj     = { val: 0 };

  gsap.to(obj, {
    val: num,
    duration: 1.5,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = (isFloat ? obj.val.toFixed(2) : Math.round(obj.val)) + suffix;
    },
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true
    }
  });
});


/* ── 11. Page Exit Transition ──────────────────────────────── */

// Warna sweep per section sesuai palette
const sectionColors = {
  '#hero':     '#1e1033',
  '#about':    '#3b0764',
  '#projects': '#4c1d95',
  '#skills':   '#5b21b6',
  '#contact':  '#6d28d9',
};

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    gsap.timeline()
      .set(overlay, { transformOrigin: 'bottom', scaleY: 0 })
      .to(overlay, { scaleY: 1, duration: 0.45, ease: 'expo.in' })
      .call(() => { target.scrollIntoView({ behavior: 'instant' }); })
      .to(overlay, { scaleY: 0, duration: 0.65, ease: 'expo.out', transformOrigin: 'top' });
  });
});

/* ── 12. Project Modal ─────────────────────────────────────── */
const projects = {
  0: {
    year: '2026',
    type: 'Campus Project',
    title: "KasirTa'",
    tagline: "Web-based POS application built for Indonesian UMKM — small warungs and cafes. Free, no subscription required.",
    problem: "Small warung and cafe owners rely on manual transaction recording, leading to frequent calculation errors and no real-time sales visibility. Existing POS solutions are too expensive and too complex for their scale.",
    solution: "KasirTa' is a web-based POS application featuring a digital cashier, real-time sales reports, stock management, thermal printer integration, automated WhatsApp notifications, and offline mode.",
    role: "As UI/UX Designer, I designed the full interface — color palette, typography, design system, and interactive Figma prototype across 9 screens. As Project Manager, I coordinated the frontend and backend team.",
    highlights: [
      { num: '9', label: 'Screens' },
      { num: 'Free', label: 'No subscription' },
      { num: 'PM', label: 'Also led the team' },
    ],
    tags: ['UI/UX Design', 'Figma', 'Design System', 'Project Manager', 'Web App', 'UMKM'],
    link: 'https://www.figma.com/design/QkKVZ8sB5Gz6HydUsQoXyO/FBE---UI-UX?node-id=0-1&t=fwWdglGhOVQKugfO-1',
    images: ['img/kasirta.png'],
  },
  1: {
    year: '2025',
    type: 'Campus Project',
    title: 'AgroAI',
    tagline: "AI-based crop and seed recommendation system helping farmers make data-driven decisions based on planting month and land altitude.",
    problem: "Farmers often lack access to reliable, localized guidance on which crops and seed types are suitable for their land conditions — leading to suboptimal yields and wasted resources.",
    solution: "A recommendation system leveraging local agricultural data and machine learning to suggest suitable crops and seed types. The trained model is integrated into an interactive web interface for practical everyday use.",
    role: "ML Engineer — handled data preprocessing, feature encoding, and model training using the Random Forest algorithm, plus performance evaluation to ensure reliable predictions. Trained model integrated into an interactive web interface.",
    highlights: [
      { num: 'RF', label: 'Random Forest' },
      { num: 'AI', label: 'Model-based' },
      { num: 'Web', label: 'Interface' },
    ],
    tags: ['Python', 'Machine Learning', 'Random Forest', 'AI', 'Data Preprocessing', 'Feature Encoding'],
    link: 'https://github.com/drgnov-305/alp_ai.git',
    images: ['img/agro_ai.png'],
  },
  2: {
    year: '2025',
    type: 'Campus Project',
    title: 'Imunetra',
    tagline: "A field-driven mobile app for early pneumonia detection — where I first experienced the full cycle of testing, observing, and improving a product based on real user behavior. ",
    problem: "Early detection of pneumonia in remote areas is hampered by fragmented data, lack of coordination tools, and no centralized reporting system for field volunteers.",
    solution: "A mobile app enabling volunteers and medical staff to collaboratively monitor and report child health data — validated through structured usability testing and a 5-second first impression test with real field users.",
    role: "UI/UX Designer with a strong testing focus — conducted user interviews, designed task-based evaluation scenarios, documented findings, and iterated on the design based on structured feedback. Achieved 93% task completion rate across 5 participants (who has stakeholder from a volunteers and medical staff sides). This project introduced me to the discipline of systematic testing and quality validation.",
    highlights: [
      { num: '93%', label: 'Task completion' },
      { num: '5', label: 'Participants' },
      { num: '5s', label: 'First impression test' },
    ],
    tags: ['UI/UX Design', 'Figma', 'Usability Testing', 'Mobile', 'Healthcare', 'User Research'],
    link: 'https://www.figma.com/design/etiM0baPcyeWxtqEWivH69/ALP-Kelompok-9?node-id=273-783&t=VM2aUHc3YoBQiwjz-1',
    images: ['img/imunetra.png'],
  },
  3: {
    year: '2024',
    type: 'Campus Project',
    title: 'PeduliPanti',
    tagline: "A mobile app bridging donors and orphanages — ensuring every donation directly meets the needs of the children.",
    problem: "Orphanage administrators struggle to manage incoming donations efficiently. There's no centralized system to track donation requests, leading to mismatched needs and wasted contributions.",
    solution: "PeduliPanti connects donors and orphanage admins through a structured platform — admins can request specific items, track donations, and manage inventory, while donors can see exactly what's needed.",
    role: "Frontend Developer — built the admin dashboard using HTML, CSS, and JavaScript. Developed pages for item request management, donation tracking, and administrator overview. Collaborated with the UI/UX design team to ensure consistency and simplicity across the interface.",
    highlights: [
      { num: 'Admin', label: 'Dashboard' },
      { num: 'Mobile', label: 'Platform' },
      { num: '2', label: 'Tech stacks' },
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Flutter', 'Laravel', 'Dashboard', 'Mobile App'],
    link: 'https://github.com/trfyrt/PeduliPanti.git',
    images: ['img/peduli_panti.png', 'img/peduli_panti_2.png'],
  },
  4: {
    year: '2024',
    type: 'Campus Project',
    title: 'Pulauwesi',
    tagline: "A tourism platform surfacing lesser-known Sulawesi islands — because hidden places deserve visibility.",
    problem: "Hidden islands like Pulau Lanjukkang remain undiscovered not because they lack value, but because they lack a digital presence. No promotional website, no structured travel info, no way to be discovered online.",
    solution: "A tourism platform with Pulau Lanjukkang as the main showcase, featuring location info, curated photography, and firsthand travel tips — originated from a direct field visit to the island.",
    role: "UI Designer — visual research, layout structuring, competitor analysis, and basic frontend implementation (HTML).",
    highlights: [
      { num: '1', label: 'Field visit' },
      { num: 'Web', label: 'Platform' },
      { num: 'HTML', label: 'Frontend' },
    ],
    tags: ['UI Design', 'Figma', 'HTML', 'Tourism', 'Web', 'South Sulawesi'],
    link: 'https://github.com/Javinpro/ALP-Project-Pulauwesi',
    images: ['img/pulauwesi.png', 'img/pulauwesi_2.png'],
  },
  5: {
    year: '2023',
    type: 'Campus Project',
    title: 'Fihu Car',
    tagline: "My first campus project — a mobile platform simplifying vehicle rental from browse to active booking management.",
    problem: "Car rental services often lack a seamless digital booking experience, leaving users confused about availability, pricing, and trip management.",
    solution: "A mobile platform that simplifies the end-to-end rental journey — from browsing vehicles to managing active bookings — backed by business model analysis, customer segmentation, and competitor research.",
    role: "UI/UX Designer — user flow mapping, information architecture, UI design, business model analysis, and competitor benchmarking.",
    highlights: [
      { num: '#1', label: 'First project' },
      { num: 'Mobile', label: 'Platform' },
      { num: 'B2C', label: 'Business model' },
    ],
    tags: ['UI/UX Design', 'Figma', 'Mobile', 'Business Model', 'Vehicle Rental', 'Competitor Research'],
    link: 'https://www.figma.com/design/fhP5RvXeLuyfZpthlVyTLq/1st-Semester-Project--Fihu-Car?node-id=0-1&t=vg8vRxqmfO1weLZ0-1',
    images: ['img/fihu_car.png'],
  },
};

const modalOverlay  = document.getElementById('modal-overlay');
const modalClose    = document.getElementById('modal-close');
const modalTitle    = document.getElementById('modal-title');
const modalYear     = document.getElementById('modal-year');
const modalType     = document.getElementById('modal-type');
const modalTagline  = document.getElementById('modal-tagline');
const modalProblem  = document.getElementById('modal-problem');
const modalSolution = document.getElementById('modal-solution');
const modalRole     = document.getElementById('modal-role');
const modalHL       = document.getElementById('modal-highlights');
const modalTags     = document.getElementById('modal-tags');
const modalCTA      = document.getElementById('modal-cta');
const modalImages   = document.getElementById('modal-images');

function openModal(index) {
  const p = projects[index];
  if (!p) return;

  modalYear.textContent     = p.year;
  modalType.textContent     = p.type;
  modalTitle.textContent    = p.title;
  modalTagline.textContent  = p.tagline;
  modalProblem.textContent  = p.problem;
  modalSolution.textContent = p.solution;
  modalRole.textContent     = p.role;
  modalCTA.href             = p.link;

  modalHL.innerHTML = p.highlights.map(h => `
    <div class="highlight-item">
      <div class="highlight-num">${h.num}</div>
      <div class="highlight-label">${h.label}</div>
    </div>
  `).join('');

  modalTags.innerHTML = p.tags.map(t =>
    `<span class="tag">${t}</span>`
  ).join('');

  if (p.images && p.images.length > 0) {
    modalImages.innerHTML = p.images.map(src =>
      `<img src="${src}" alt="${p.title} mockup" />`
    ).join('');
  } else {
    modalImages.innerHTML = `
      <div class="mockup-placeholder">
        <span>Mockup preview</span>
      </div>
    `;
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  gsap.fromTo('#modal',
    { y: 32, opacity: 0, scale: 0.96 },
    { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
  );
}

function closeModal() {
  gsap.to('#modal', {
    y: 20,
    opacity: 0,
    scale: 0.96,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Klik tombol ↗
document.querySelectorAll('.project-link').forEach((btn, index) => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openModal(index);
  });
});

// Tombol close
modalClose.addEventListener('click', closeModal);

// Klik di luar modal
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// Tekan Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── Back to Top ───────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');

// Muncul setelah scroll 400px
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

// Klik — scroll ke hero dengan animasi
backToTop.addEventListener('click', () => {
  gsap.timeline()
    .set(overlay, { transformOrigin: 'bottom', scaleY: 0 })
    .to(overlay, {
      scaleY: 1,
      duration: 0.45,
      ease: 'expo.in',
      onStart: () => { gsap.set(overlay, { background: '#1e1033' }); }
    })
    .call(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    })
    .to(overlay, {
      scaleY: 0,
      duration: 0.65,
      ease: 'expo.out',
      transformOrigin: 'top'
    });
});

/* ── Theme Toggle ──────────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');

// Cek saved preference
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (savedTheme === 'dark') themeToggle.classList.add('dark');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.classList.toggle('dark', next === 'dark');
});

