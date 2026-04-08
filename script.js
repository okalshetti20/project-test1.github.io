// Premium micro-interactions and animations
window.addEventListener('load', () => {
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .project-card, .cert-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(1.8)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
    });
  }
});

// Sticky navbar + active highlight
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// Smooth scroll
document.querySelectorAll('.nav-link, .hero-buttons .btn').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('data-target') || this.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth <= 900) {
        document.getElementById('nav-menu')?.classList.remove('active');
        document.getElementById('hamburger')?.classList.remove('active');
      }
    }
  });
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Typing effect (updated phrases)
const words = ["Building the future", "Creative developer", "Video editor", "AI explorer", "Design thinker"];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typedSpan = document.getElementById('typed-text');
function typeEffect() {
  const currentWord = words[wordIndex];
  if (isDeleting) typedSpan.textContent = currentWord.substring(0, charIndex-1), charIndex--;
  else typedSpan.textContent = currentWord.substring(0, charIndex+1), charIndex++;
  if (!isDeleting && charIndex === currentWord.length) { isDeleting = true; setTimeout(typeEffect, 1500); return; }
  if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex+1)%words.length; setTimeout(typeEffect, 200); return; }
  setTimeout(typeEffect, isDeleting ? 70 : 120);
}
typeEffect();

// Animate progress bars
const progressBars = document.querySelectorAll('.progress-fill');
function animateProgress() {
  progressBars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100 && !bar.classList.contains('animated')) {
      bar.style.width = bar.getAttribute('data-width') + '%';
      bar.classList.add('animated');
    }
  });
}
window.addEventListener('scroll', animateProgress);
animateProgress();

// Intersection Observer for reveal
const revealElements = document.querySelectorAll('.section, .glass-card, .skill-item, .achievement-card, .cert-card, .project-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.1 });
revealElements.forEach(el => { el.classList.add('reveal'); observer.observe(el); });

// Ripple effect
document.querySelectorAll('.ripple-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = e.clientX - rect.left - size/2 + 'px';
    ripple.style.top = e.clientY - rect.top - size/2 + 'px';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Form validation
const form = document.getElementById('contactForm');
const feedback = document.getElementById('form-feedback');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) {
    feedback.innerHTML = '<span style="color:#f87171;">✧ All fields are required ✧</span>';
    return;
  }
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  if (!emailRegex.test(email)) {
    feedback.innerHTML = '<span style="color:#f87171;">✧ Please enter a valid email ✧</span>';
    return;
  }
  feedback.innerHTML = '<span style="color:#4ade80;">✓ Message sent successfully! (Demo)</span>';
  form.reset();
  setTimeout(() => feedback.innerHTML = '', 3000);
});

// Particles background
const canvas = document.getElementById('particles-canvas');
let ctx = canvas?.getContext('2d');
let particles = [];
function resizeCanvas() { if(canvas){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.2;
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.15;
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x > canvas.width) this.x = 0; if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0; if (this.y < 0) this.y = canvas.height;
  }
  draw() { ctx.fillStyle = `rgba(80, 150, 255, ${this.opacity})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill(); }
}
function initParticles() {
  if(!canvas) return;
  particles = [];
  let count = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
  for(let i=0;i<count;i++) particles.push(new Particle());
}
function animateParticles() {
  if(!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
if(canvas) { resizeCanvas(); initParticles(); animateParticles(); }

// GitHub buttons - open repositories
document.querySelectorAll('.github-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const url = btn.getAttribute('data-url');
    if (url) window.open(url, '_blank');
    else alert('GitHub repository link will be added soon.');
  });
});

// Parallax effect on hero image
window.addEventListener('mousemove', (e) => {
  const heroImg = document.querySelector('.profile-photo');
  if(heroImg && window.innerWidth > 768) {
    let x = (e.clientX / window.innerWidth - 0.5) * 15;
    let y = (e.clientY / window.innerHeight - 0.5) * 15;
    heroImg.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(10px)`;
  }
});
