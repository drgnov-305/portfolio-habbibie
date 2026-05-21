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
const heroTL = gsap.timeline({ delay: 0.7 });

heroTL
  .to('.hero-tag', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  })
  .to('.hero-name .line span', {
    y: 0,
    duration: 1,
    ease: 'expo.out',
    stagger: 0.12
  }, '-=0.2')
  .to('.hero-desc', {
    opacity: 1,
    duration: 0.7,
    ease: 'power2.out'
  }, '-=0.4')
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
    tagline: "A field-driven mobile app for volunteers and healthcare workers in remote areas — enabling early pneumonia detection through collaborative health monitoring.",
    problem: "Early detection of pneumonia in remote areas is hampered by fragmented data, lack of coordination tools, and no centralized reporting system for field volunteers.",
    solution: "A mobile app enabling volunteers and medical staff to collaboratively monitor, report, and analyze child health data — validated through user interviews, usability testing, and a 5-second test with real field users.",
    role: "UI/UX Designer — user interviews, survey design, user flow mapping, wireframing, low-fidelity prototyping, usability testing, and iterative refinement based on feedback.",
    highlights: [
      { num: '93%', label: 'Task completion' },
      { num: '5', label: 'Participants' },
      { num: '5s', label: 'First impression test' },
    ],
    tags: ['UI/UX Design', 'Figma', 'Usability Testing', 'Mobile', 'Healthcare', 'User Research'],
    link: '#',
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
    link: '#',
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
    link: '#',
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