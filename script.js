/* ======================================================================
   SAVE-THE-DATE TEMPLATE — CONFIG
   Edit the values below to customize the page. Nothing else in this file
   needs to change for a basic re-skin.
   ====================================================================== */
const CONFIG = {
  partner1: "Omar",
  partner2: "Aya",

  // Photo shown between the two names in the hero.
  heroPhoto: "assets/BLA00114.JPG",

  // ISO datetime for the event — drives the reveal date, weekday, time and countdown.
  eventDate: "2026-09-05T18:00:00",

  location: "Helnan Antoniades Palace Hotel, Alexandria",
  locationMapUrl: "https://maps.app.goo.gl/eBSDNQrqgraCQ9dP7",

  // Venue photos — add/remove paths here to change what shows up.
  venueGallery: [
    "assets/venue-01.png",
    "assets/venue-02.png",
  ],

  // Gallery images — add/remove paths here to change what shows up.
  gallery: [
    "assets/BLA00011.JPG",
    "assets/BLA00014.JPG",
    "assets/BLA00114.JPG",
    "assets/BLA00118.JPG",
    "assets/BLA00142.JPG",
    "assets/BLA00146.JPG",
    "assets/BLA00155.JPG",
  ],

  palette: [
    { name: "Blush Pink", hex: "#FDB0C0" },
    { name: "Pistachio Green", hex: "#B5D685" },
    { name: "Butter Yellow", hex: "#FFF487" },
    { name: "Champagne", hex: "#FBDFBB" },
  ],

  footerCredit: "Created by Omar Ghazala",
};

/* ====================================================================== */

function applyStaticText() {
  document.getElementById("name1").textContent = CONFIG.partner1;
  document.getElementById("name2").textContent = CONFIG.partner2;
  document.getElementById("hero-photo-img").src = CONFIG.heroPhoto;
  document.getElementById("footer-credit").textContent = CONFIG.footerCredit;
  document.getElementById("reveal-location").textContent = CONFIG.location;
  document.getElementById("location-text").textContent = CONFIG.location;
  document.getElementById("location-link").href = CONFIG.locationMapUrl;

  const eventDate = new Date(CONFIG.eventDate);
  const dateFmt = new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
  const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" });
  const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

  document.getElementById("reveal-date").textContent = dateFmt.format(eventDate).replaceAll("/", " · ");
  document.getElementById("reveal-weekday").textContent = weekdayFmt.format(eventDate);
  document.getElementById("reveal-time").textContent = timeFmt.format(eventDate);
}

function initGallery(carouselId, trackId, dotsId, slides) {
  const carousel = document.getElementById(carouselId);
  const track = document.getElementById(trackId);
  const dotsWrap = document.getElementById(dotsId);
  const prevBtn = carousel.querySelector(".carousel-btn.prev");
  const nextBtn = carousel.querySelector(".carousel-btn.next");

  track.innerHTML = slides.map(src => `
    <div class="carousel-slide"><img src="${src}" alt="" draggable="false" loading="lazy"></div>
  `).join("");
  dotsWrap.innerHTML = slides.map((_, i) => `
    <button class="carousel-dot" data-index="${i}" aria-label="Go to photo ${i + 1}"></button>
  `).join("");

  let index = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragDeltaX = 0;

  function render(withTransition) {
    track.style.transition = withTransition ? "transform 0.35s ease" : "none";
    track.style.transform = `translateX(${-index * 100}%)`;
    dotsWrap.querySelectorAll(".carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    render(true);
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
  dotsWrap.addEventListener("click", (e) => {
    const dot = e.target.closest(".carousel-dot");
    if (dot) goTo(Number(dot.dataset.index));
  });

  function onPointerDown(e) {
    if (e.target.closest(".carousel-btn")) return;
    dragging = true;
    dragStartX = e.clientX;
    dragDeltaX = 0;
    track.style.transition = "none";
    carousel.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    dragDeltaX = e.clientX - dragStartX;
    const percent = (dragDeltaX / carousel.clientWidth) * 100;
    track.style.transform = `translateX(${-index * 100 + percent}%)`;
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    const threshold = carousel.clientWidth * 0.18;
    if (dragDeltaX > threshold) {
      goTo(index - 1);
    } else if (dragDeltaX < -threshold) {
      goTo(index + 1);
    } else {
      render(true);
    }
  }

  carousel.addEventListener("pointerdown", onPointerDown);
  carousel.addEventListener("pointermove", onPointerMove);
  carousel.addEventListener("pointerup", onPointerUp);
  carousel.addEventListener("pointercancel", onPointerUp);
  carousel.addEventListener("pointerleave", () => { if (dragging) onPointerUp(); });

  render(false);
}

function renderPalette() {
  const grid = document.getElementById("palette-grid");
  grid.innerHTML = CONFIG.palette.map(c => `
    <div class="swatch">
      <div class="swatch-color" style="background:${c.hex}"></div>
      <div class="swatch-name">${c.name}</div>
      <div class="swatch-hex">${c.hex}</div>
    </div>
  `).join("");
}

function startCountdown() {
  const target = new Date(CONFIG.eventDate).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
  };

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    els.days.textContent = String(days).padStart(2, "0");
    els.hours.textContent = String(hours).padStart(2, "0");
    els.minutes.textContent = String(minutes).padStart(2, "0");
    els.seconds.textContent = String(seconds).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  applyStaticText();
  initGallery("venue-gallery-carousel", "venue-carousel-track", "venue-carousel-dots", CONFIG.venueGallery);
  initGallery("gallery-carousel", "carousel-track", "carousel-dots", CONFIG.gallery);
  renderPalette();
  startCountdown();
});
