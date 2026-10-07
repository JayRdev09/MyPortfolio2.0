
const frameCount = 240;
const cacheRadius = 7;
const frameDirectory = "Man_adjusting_tie_frames_24fps";
const canvas = document.querySelector("#sequence");
const context = canvas.getContext("2d", { alpha: false });
const progressBar = document.querySelector("#scene-progress");
const frameCountLabel = document.querySelector("#frame-count");
const frameCache = new Map();
const pendingFrames = new Map();
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let targetFrame = 0;
let displayedFrame = 0;
let displayedFrameIndex = 0;
let scrollDirection = 1;
let lastScrollY = window.scrollY;
let scrollFramePending = false;
let animationFrame = 0;
let previousAnimationTime = 0;

function framePath(index) {
  return `${frameDirectory}/frame_${String(index + 1).padStart(6, "0")}.png`;
}

function loadFrame(index) {
  if (frameCache.has(index)) return Promise.resolve(frameCache.get(index));
  if (pendingFrames.has(index)) return pendingFrames.get(index);

  const image = new Image();
  image.decoding = "async";
  const request = new Promise((resolve, reject) => {
    image.onload = async () => {
      try {
        const bitmap = await createImageBitmap(image);
        frameCache.set(index, bitmap);
        trimCache();
        resolve(bitmap);
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = reject;
    image.src = framePath(index);
  }).finally(() => pendingFrames.delete(index));

  pendingFrames.set(index, request);
  return request;
}

function trimCache() {
  for (const [index, bitmap] of frameCache) {
    const targetDistance = Math.abs(index - targetFrame);
    const displayDistance = Math.abs(index - displayedFrame);
    if (Math.min(targetDistance, displayDistance) > cacheRadius) {
      bitmap.close();
      frameCache.delete(index);
    }
  }
}

function drawFrame(bitmap, nextBitmap = bitmap, blend = 0) {
  const scale = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;
  const x = (canvas.width - width) / 2;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = 1;
  context.drawImage(bitmap, x, 0, width, height);
  if (nextBitmap !== bitmap && blend > 0) {
    context.globalAlpha = blend;
    context.drawImage(nextBitmap, x, 0, width, height);
    context.globalAlpha = 1;
  }
}

function requestFrame(index) {
  const lowerIndex = Math.max(0, Math.min(frameCount - 1, Math.floor(index)));
  const upperIndex = Math.min(lowerIndex + 1, frameCount - 1);
  const blend = upperIndex === lowerIndex ? 0 : index - lowerIndex;
  const lowerBitmap = frameCache.get(lowerIndex);

  if (!lowerBitmap) {
    loadFrame(lowerIndex).then(() => requestFrame(displayedFrame)).catch(() => {});
    return;
  }

  if (upperIndex === lowerIndex) {
    drawFrame(lowerBitmap);
    return;
  }

  const upperBitmap = frameCache.get(upperIndex);
  if (upperBitmap) {
    drawFrame(lowerBitmap, upperBitmap, blend);
    return;
  }

  drawFrame(lowerBitmap);
  loadFrame(upperIndex).then(() => {
    if (Math.floor(displayedFrame) === lowerIndex) requestFrame(displayedFrame);
  }).catch(() => {});
}

function animateSequence(timestamp) {
  animationFrame = 0;
  const elapsed = previousAnimationTime ? Math.min(timestamp - previousAnimationTime, 64) : 16.7;
  previousAnimationTime = timestamp;
  const easing = 1 - Math.exp(-elapsed / 68);
  displayedFrame += (targetFrame - displayedFrame) * easing;

  const nextFrame = Math.round(displayedFrame);
  if (nextFrame !== displayedFrameIndex) {
    displayedFrameIndex = nextFrame;
    trimCache();
  }
  requestFrame(displayedFrame);
  frameCountLabel.textContent = `${String(displayedFrameIndex + 1).padStart(3, "0")} / ${frameCount}`;

  if (Math.abs(targetFrame - displayedFrame) > 0.08) {
    animationFrame = window.requestAnimationFrame(animateSequence);
    return;
  }

  displayedFrame = targetFrame;
  const finalFrame = Math.round(displayedFrame);
  displayedFrameIndex = finalFrame;
  requestFrame(displayedFrame);
  frameCountLabel.textContent = `${String(displayedFrameIndex + 1).padStart(3, "0")} / ${frameCount}`;
  previousAnimationTime = 0;
}

function queueSequenceAnimation() {
  if (prefersReducedMotion.matches) {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    previousAnimationTime = 0;
    displayedFrame = targetFrame;
    displayedFrameIndex = Math.round(displayedFrame);
    frameCountLabel.textContent = `${String(displayedFrameIndex + 1).padStart(3, "0")} / ${frameCount}`;
    requestFrame(displayedFrame);
    return;
  }

  if (!animationFrame) animationFrame = window.requestAnimationFrame(animateSequence);
}

function updateSequence() {
  const scrollY = window.scrollY;
  scrollDirection = scrollY >= lastScrollY ? 1 : -1;
  lastScrollY = scrollY;

  const scrollDistance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollDistance > 0 ? Math.min(1, Math.max(0, scrollY / scrollDistance)) : 0;
  targetFrame = progress * (frameCount - 1);
  progressBar.style.transform = `scaleX(${progress})`;
  trimCache();
  queueSequenceAnimation();

  for (let offset = 1; offset <= 6; offset += 1) {
    const nextFrame = Math.round(targetFrame) + offset * scrollDirection;
    if (nextFrame >= 0 && nextFrame < frameCount) loadFrame(nextFrame).catch(() => {});
  }

  const siteHeader = document.querySelector(".site-header");
  const aboutSection = document.querySelector("#about");
  if (siteHeader) {
    const isPastHero = aboutSection ? scrollY >= (aboutSection.offsetTop - 85) : scrollY > window.innerHeight;
    siteHeader.classList.toggle("is-scrolled", isPastHero);
  }
}

function scheduleSequenceUpdate() {
  if (scrollFramePending) return;
  scrollFramePending = true;
  window.requestAnimationFrame(() => {
    updateSequence();
    scrollFramePending = false;
  });
}

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(canvas.clientWidth * pixelRatio);
  canvas.height = Math.round(canvas.clientHeight * pixelRatio);
  requestFrame(displayedFrame);
}

const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("is-open");
  }
});

const roles = ["Flutter & web developer", "AI & IoT innovator", "Problem solver"];
const typingText = document.querySelector("#typing-text");
let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

const appScreens = [
  { title: "Sign Up Screen", module: "Accessing the application", description: "New users create a personalized account with an email address and password.", alt: "Tomato farming app sign up screen" },
  { title: "Login Screen", module: "Accessing the application", description: "Returning users sign in to access their saved plants, soil readings, and analysis history.", alt: "Tomato farming app login screen" },
  { title: "New Plant Registration", module: "Plant profiling", description: "Register a tomato plant with its variety, planting date, and initial notes.", alt: "New tomato plant registration screen" },
  { title: "Plant Profile Details", module: "Plant profiling", description: "Review an individual plant profile and its health-tracking information.", alt: "Tomato plant profile overview screen" },
  { title: "Growth Stage Status", module: "Growth and harvest", description: "See the current developmental stage of a selected tomato plant.", alt: "Tomato growth stage screen" },
  { title: "Growth Timeline", module: "Growth and harvest", description: "Follow the plant's progression from vegetative growth toward fruiting.", alt: "Tomato plant growth timeline screen" },
  { title: "Growth Milestones", module: "Growth and harvest", description: "Track important plant development milestones and health checkpoints.", alt: "Tomato growth milestones screen" },
  { title: "Stage Health Metrics", module: "Growth and harvest", description: "Review health indicators alongside the plant's active growth phase.", alt: "Tomato growth health metrics screen" },
  { title: "Harvest Prediction", module: "Growth and harvest", description: "Estimate the harvest date using planting information and expected growth timelines.", alt: "Tomato harvest prediction calendar screen" },
  { title: "Harvest Schedule", module: "Growth and harvest", description: "View a suggested harvest window to support farm activity planning.", alt: "Tomato harvest schedule screen" },
  { title: "Live Soil Dashboard", module: "Real-time soil data", description: "See ESP32 sensor readings for moisture, temperature, pH, and soil nutrients.", alt: "Live soil sensor dashboard" },
  { title: "Soil Suitability", module: "Soil suitability", description: "Compare current sensor readings with optimal ranges for tomato cultivation.", alt: "Soil suitability assessment screen" },
  { title: "Nutrient Range Verdict", module: "Soil suitability", description: "Identify high and low readings across moisture, pH, and nutrient levels.", alt: "Soil nutrient range verdict screen" },
  { title: "Soil Recommendations", module: "Soil suitability", description: "Get practical watering and fertilization suggestions based on the soil assessment.", alt: "Soil amendments recommendation screen" },
  { title: "Camera Leaf Capture", module: "Plant image capture", description: "Capture a clear plant or leaf image for automated disease analysis.", alt: "Tomato leaf camera capture screen" },
  { title: "Gallery Image Picker", module: "Plant image capture", description: "Choose an existing plant image from the device gallery for analysis.", alt: "Plant image gallery picker screen" },
  { title: "Image Enhancement", module: "AI analysis", description: "Adjust image brightness and contrast before running the plant health analysis.", alt: "Plant image enhancement screen" },
  { title: "Analysis Trigger", module: "AI analysis", description: "Confirm the selected image and begin the disease-classification workflow.", alt: "AI plant analysis confirmation screen" },
  { title: "AI Classification Result", module: "AI analysis", description: "View the identified plant and its predicted disease or health status.", alt: "AI tomato disease classification result screen" },
  { title: "Treatment Plan", module: "AI analysis", description: "Review sensor-informed treatment guidance and recommended next steps.", alt: "Plant treatment recommendation screen" },
  { title: "Cultivation Guide", module: "Best practices", description: "Read practical guidance for watering, spacing, and pruning tomato plants.", alt: "Tomato cultivation best practices screen" },
  { title: "Pest Management Guide", module: "Best practices", description: "Explore integrated pest management guidance for common tomato diseases.", alt: "Tomato pest management reference screen" },
  { title: "Analysis History", module: "History", description: "Revisit previous plant diagnoses, soil readings, and recommendations.", alt: "Plant diagnostic history screen" },
  { title: "Quick Actions", module: "Account and session", description: "Open the account menu for navigation and session actions.", alt: "Tomato farming app quick actions menu" },
  { title: "Logout Confirmation", module: "Account and session", description: "End the current app session and return to the sign-in screen.", alt: "Tomato farming app logout confirmation screen" }
];
const flashcard = document.querySelector("#project-flashcard");
const flashcardImage = document.querySelector("#flashcard-image");
const flashcardCount = document.querySelector("#flashcard-count");
const flashcardFlipButton = document.querySelector("#flashcard-flip");
const screenModules = [1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 9, 10, 10];
let activeScreenIndex = 0;

function renderFlashcard() {
  const screen = appScreens[activeScreenIndex];
  const screenNumber = String(activeScreenIndex + 1).padStart(2, "0");
  const moduleNumber = String(screenModules[activeScreenIndex]).padStart(2, "0");
  const moduleLabel = `Module ${moduleNumber} / ${screen.module}`;

  flashcard.classList.remove("is-flipped");
  flashcard.setAttribute("aria-pressed", "false");
  flashcard.setAttribute("aria-label", `${screen.title}. Activate to flip for details.`);
  flashcard.querySelector(".flashcard-front").setAttribute("aria-hidden", "false");
  flashcard.querySelector(".flashcard-back").setAttribute("aria-hidden", "true");
  flashcardImage.src = `tomatoai features images/image${activeScreenIndex + 1}.png`;
  flashcardImage.alt = screen.alt;
  document.querySelector("#flashcard-module").textContent = moduleLabel;
  document.querySelector("#flashcard-title").textContent = screen.title;
  document.querySelector("#flashcard-back-module").textContent = moduleLabel;
  document.querySelector("#flashcard-back-title").textContent = screen.title;
  document.querySelector("#flashcard-description").textContent = screen.description;
  flashcardCount.textContent = `${screenNumber} / ${appScreens.length}`;
  flashcardFlipButton.innerHTML = '<span aria-hidden="true">↻</span> Flip card';
}

function flipFlashcard() {
  const isFlipped = flashcard.classList.toggle("is-flipped");
  flashcard.setAttribute("aria-pressed", String(isFlipped));
  flashcard.querySelector(".flashcard-front").setAttribute("aria-hidden", String(isFlipped));
  flashcard.querySelector(".flashcard-back").setAttribute("aria-hidden", String(!isFlipped));
  flashcardFlipButton.innerHTML = isFlipped
    ? '<span aria-hidden="true">↻</span> Show screen'
    : '<span aria-hidden="true">↻</span> Flip card';
}

flashcard.addEventListener("click", flipFlashcard);
flashcardFlipButton.addEventListener("click", flipFlashcard);
document.querySelector("#flashcard-previous").addEventListener("click", () => {
  activeScreenIndex = (activeScreenIndex - 1 + appScreens.length) % appScreens.length;
  renderFlashcard();
});
document.querySelector("#flashcard-next").addEventListener("click", () => {
  activeScreenIndex = (activeScreenIndex + 1) % appScreens.length;
  renderFlashcard();
});
renderFlashcard();

function animateCardSlide(card, faceSelector, direction) {
  if (!direction || prefersReducedMotion.matches) return;

  const face = card.querySelector(faceSelector);
  face.animate([
    { opacity: 0.7, transform: `translateX(${direction * 22}px)` },
    { opacity: 1, transform: "translateX(0)" }
  ], { duration: 260, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
}

function addHorizontalSwipe(card, navigate) {
  let startX = null;
  let suppressClickUntil = 0;

  card.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") startX = event.clientX;
  });
  card.addEventListener("pointerup", (event) => {
    if (startX === null) return;
    const distance = event.clientX - startX;
    startX = null;
    if (Math.abs(distance) > 48) {
      suppressClickUntil = Date.now() + 500;
      navigate(distance < 0 ? 1 : -1);
    }
  });
  card.addEventListener("pointercancel", () => {
    startX = null;
  });
  card.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

const certificateHighlights = [
  { image: "cert/6183852260647965891.jpg", alt: "Certificate recognizing the thesis as second best paper", title: "2nd Best Paper", description: "Oral presentation recognition for research integrating AI-powered image recognition with ESP32 soil sensor analytics.", meta: "JRMSU / June 2026" },
  { image: "cert/6183852260647965892.jpg", alt: "Certificate recognizing the thesis for innovation", title: "3rd Most Innovative Research", description: "Recognized for an applied approach to precision crop management through AI diagnosis and connected soil sensing.", meta: "JRMSU / June 2026" }
];
const certificateCard = document.querySelector("#certificate-flashcard");
const certificateImage = document.querySelector("#certificate-flashcard-image");
const certificateCount = document.querySelector("#certificate-count");
let activeCertificateIndex = 0;

function renderCertificateCard(direction = 0) {
  const certificate = certificateHighlights[activeCertificateIndex];
  const number = String(activeCertificateIndex + 1).padStart(2, "0");
  const total = String(certificateHighlights.length).padStart(2, "0");

  certificateCard.classList.remove("is-flipped");
  certificateCard.setAttribute("aria-pressed", "false");
  certificateCard.setAttribute("aria-label", `Flip the ${certificate.title} certificate card.`);
  certificateCard.querySelector(".award-front").setAttribute("aria-hidden", "false");
  certificateCard.querySelector(".award-back").setAttribute("aria-hidden", "true");
  certificateImage.src = certificate.image;
  certificateImage.alt = certificate.alt;
  document.querySelector("#certificate-flashcard-title").textContent = certificate.title;
  document.querySelector("#certificate-flashcard-back-title").textContent = certificate.title;
  document.querySelector("#certificate-flashcard-description").textContent = certificate.description;
  document.querySelector("#certificate-flashcard-meta").textContent = certificate.meta;
  certificateCount.textContent = `${number} / ${total}`;
  animateCardSlide(certificateCard, ".award-front", direction);

  const certificateFlipBtn = document.querySelector("#certificate-flip");
  if (certificateFlipBtn) {
    certificateFlipBtn.innerHTML = '<span aria-hidden="true">↻</span> Flip card';
  }

  const adjacent = (activeCertificateIndex + (direction < 0 ? -1 : 1) + certificateHighlights.length) % certificateHighlights.length;
  const preload = new Image();
  preload.src = certificateHighlights[adjacent].image;
}

document.querySelector("#certificate-flip").addEventListener("click", () => certificateCard.click());
document.querySelector("#certificate-previous").addEventListener("click", () => {
  activeCertificateIndex = (activeCertificateIndex - 1 + certificateHighlights.length) % certificateHighlights.length;
  renderCertificateCard(-1);
});
document.querySelector("#certificate-next").addEventListener("click", () => {
  activeCertificateIndex = (activeCertificateIndex + 1) % certificateHighlights.length;
  renderCertificateCard(1);
});
addHorizontalSwipe(certificateCard, (direction) => {
  activeCertificateIndex = (activeCertificateIndex + direction + certificateHighlights.length) % certificateHighlights.length;
  renderCertificateCard(direction);
});
renderCertificateCard();

const groupHighlights = [
  { image: "group/6120657855611342579 (1).jpg", alt: "Group photo from the JRMSU Techtopia research event", category: "JRMSU / CCS Techtopia", title: "Research Event", description: "A group photo from the JRMSU Techtopia research event, celebrating the work and everyone who contributed." },
  { image: "group/6120657855611342580 (1).jpg", alt: "Group photo at the JRMSU CCS Research Congress", category: "JRMSU / CCS", title: "Research Congress", description: "A moment with fellow participants at the CCS research congress." },
  { image: "group/6194838658142115992.jpg", alt: "Family celebrating an academic award", category: "Recognition / Family", title: "Award Celebration", description: "Sharing an academic milestone and research recognition with family." },
  { image: "group/6194838658142115993.jpg", alt: "Graduation celebration with family", category: "Education / Family", title: "Graduation", description: "Celebrating graduation and the people who supported the journey." },
  { image: "group/image.png", alt: "Robotics training workshop at JRMSU", category: "JRMSU / Robotics", title: "Robotics Training", description: "Taking part in a robotics training workshop at JRMSU." }
];
const groupFlashcard = document.querySelector("#group-flashcard");
const groupFlashcardImage = document.querySelector("#group-flashcard-image");
const groupFlashcardCount = document.querySelector("#group-flashcard-count");
const groupFlashcardFlipButton = document.querySelector("#group-flashcard-flip");
let activeGroupHighlight = 0;

function renderGroupFlashcard(direction = 0) {
  const highlight = groupHighlights[activeGroupHighlight];
  const cardNumber = String(activeGroupHighlight + 1).padStart(2, "0");
  const totalCards = String(groupHighlights.length).padStart(2, "0");
  const cardLabel = `${highlight.category} / ${cardNumber}`;

  groupFlashcard.classList.remove("is-flipped");
  groupFlashcard.setAttribute("aria-pressed", "false");
  groupFlashcard.setAttribute("aria-label", `${highlight.title}. Activate to flip for details.`);
  groupFlashcard.querySelector(".flashcard-front").setAttribute("aria-hidden", "false");
  groupFlashcard.querySelector(".flashcard-back").setAttribute("aria-hidden", "true");
  groupFlashcardImage.src = highlight.image;
  groupFlashcardImage.alt = highlight.alt;
  document.querySelector("#group-flashcard-category").textContent = cardLabel;
  document.querySelector("#group-flashcard-title").textContent = highlight.title;
  document.querySelector("#group-flashcard-back-category").textContent = cardLabel;
  document.querySelector("#group-flashcard-back-title").textContent = highlight.title;
  document.querySelector("#group-flashcard-description").textContent = highlight.description;
  groupFlashcardCount.textContent = `${cardNumber} / ${totalCards}`;
  groupFlashcardFlipButton.innerHTML = '<span aria-hidden="true">↻</span> Flip card';
  animateCardSlide(groupFlashcard, ".flashcard-front", direction);

  [activeGroupHighlight - 1, activeGroupHighlight + 1].forEach((index) => {
    const wrappedIndex = (index + groupHighlights.length) % groupHighlights.length;
    const image = new Image();
    image.src = groupHighlights[wrappedIndex].image;
  });
}

function flipGroupFlashcard() {
  const isFlipped = groupFlashcard.classList.toggle("is-flipped");
  groupFlashcard.setAttribute("aria-pressed", String(isFlipped));
  groupFlashcard.querySelector(".flashcard-front").setAttribute("aria-hidden", String(isFlipped));
  groupFlashcard.querySelector(".flashcard-back").setAttribute("aria-hidden", String(!isFlipped));
  groupFlashcardFlipButton.innerHTML = isFlipped
    ? '<span aria-hidden="true">↻</span> Show photo'
    : '<span aria-hidden="true">↻</span> Flip card';
}

groupFlashcard.addEventListener("click", flipGroupFlashcard);
groupFlashcardFlipButton.addEventListener("click", flipGroupFlashcard);
addHorizontalSwipe(groupFlashcard, (direction) => {
  activeGroupHighlight = (activeGroupHighlight + direction + groupHighlights.length) % groupHighlights.length;
  renderGroupFlashcard(direction);
});
document.querySelector("#group-flashcard-previous").addEventListener("click", () => {
  activeGroupHighlight = (activeGroupHighlight - 1 + groupHighlights.length) % groupHighlights.length;
  renderGroupFlashcard(-1);
});
document.querySelector("#group-flashcard-next").addEventListener("click", () => {
  activeGroupHighlight = (activeGroupHighlight + 1) % groupHighlights.length;
  renderGroupFlashcard(1);
});
renderGroupFlashcard();

const certificateFlipBtn = document.querySelector("#certificate-flip");
document.querySelectorAll(".award-card").forEach((card) => {
  card.addEventListener("click", () => {
    const isFlipped = card.classList.toggle("is-flipped");
    const title = card.querySelector(".award-front-caption strong").textContent;
    card.setAttribute("aria-pressed", String(isFlipped));
    card.setAttribute("aria-label", isFlipped
      ? `${title} certificate details. Activate to show certificate.`
      : `Flip the ${title} certificate card.`);
    card.querySelector(".award-front").setAttribute("aria-hidden", String(isFlipped));
    card.querySelector(".award-back").setAttribute("aria-hidden", String(!isFlipped));
    if (certificateFlipBtn) {
      certificateFlipBtn.innerHTML = isFlipped
        ? '<span aria-hidden="true">↻</span> Show cert'
        : '<span aria-hidden="true">↻</span> Flip card';
    }
  });
});

function typeRole() {
  const role = roles[roleIndex];
  characterIndex += deleting ? -1 : 1;
  typingText.textContent = role.slice(0, characterIndex);

  if (!deleting && characterIndex === role.length) {
    deleting = true;
    window.setTimeout(typeRole, 1700);
    return;
  }
  if (deleting && characterIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    window.setTimeout(typeRole, 350);
    return;
  }
  window.setTimeout(typeRole, deleting ? 38 : 75);
}

if (prefersReducedMotion.matches) {
  typingText.textContent = roles[0];
} else {
  typeRole();
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const heroObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".scene-copy, .scene-topline, .scene-footer").forEach((el) => {
        el.classList.add("is-visible");
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -100px 0px" });

const heroSection = document.querySelector(".scroll-scene#home");
if (heroSection) heroObserver.observe(heroSection);
window.addEventListener("scroll", scheduleSequenceUpdate, { passive: true });
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
updateSequence();
  