const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const projectsGrid = document.querySelector("#projects-grid");
const hireForm = document.querySelector("#hire-form");
const loginForm = document.querySelector("#login-form");
const logoutButton = document.querySelector("#logout-button");
const adminPanel = document.querySelector("#admin-panel");
const reportCards = document.querySelector("#report-cards");
const projectForm = document.querySelector("#project-form");
const clearProjectForm = document.querySelector("#clear-project-form");
const adminProjectsTable = document.querySelector("#admin-projects-table");
const hireRequestsTable = document.querySelector("#hire-requests-table");
const hireDialog = document.querySelector("#hire-dialog");
const hireWhatsappLink = document.querySelector("#hire-whatsapp-link");
const hireEmailLink = document.querySelector("#hire-email-link");
const reviewsGrid = document.querySelector("#reviews-grid");
const reviewForm = document.querySelector("#review-form");
const reviewDialog = document.querySelector("#review-dialog");
const adminReviewsTable = document.querySelector("#admin-reviews-table");

let state = {
  projects: [],
  reviews: [],
  me: null,
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin",
    ...options,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
};

const formJson = (form) => {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  const features = formData.getAll("features");
  if (features.length) payload.features = features;
  return payload;
};

const setStatus = (form, message, isError = false) => {
  const status = form?.querySelector(".form-status");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("error", isError);
};

function initHeader() {
  if (!header || !navToggle || !nav) return;

  const setHeaderState = () => header.classList.toggle("scrolled", window.scrollY > 20);
  setHeaderState();
  window.addEventListener("scroll", setHeaderState);

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((element) => element.classList.add("visible"));
    return;
  }

  revealItems.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 40, 280)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.14 }
  );
  revealItems.forEach((element) => observer.observe(element));
}

function initProfileTilt() {
  const card = document.querySelector("#profile-card");
  if (!card) return;

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 16}deg) rotateX(${-y * 12}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
}

function initHeroCanvas() {
  const canvas = document.querySelector("#hero-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const dots = Array.from({ length: 72 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random() * 0.8 + 0.2,
    speed: Math.random() * 0.0008 + 0.00025,
    hue: index % 3,
  }));
  const pointer = { x: 0, y: 0 };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / window.innerWidth - 0.5;
    pointer.y = event.clientY / window.innerHeight - 0.5;
  });
  resize();

  const draw = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    context.clearRect(0, 0, width, height);

    dots.forEach((dot, index) => {
      dot.y -= dot.speed;
      dot.x += Math.sin(performance.now() * 0.0003 + index) * 0.00018;
      if (dot.y < -0.08) {
        dot.y = 1.08;
        dot.x = Math.random();
      }

      const depth = 0.55 + dot.z * 0.8;
      const x = dot.x * width + pointer.x * 44 * depth;
      const y = dot.y * height + pointer.y * 28 * depth;
      const radius = 1.5 + dot.z * 4;
      const color = dot.hue === 0 ? "163, 230, 53" : dot.hue === 1 ? "6, 182, 212" : "255, 255, 255";

      context.beginPath();
      context.fillStyle = `rgba(${color}, ${0.22 + dot.z * 0.42})`;
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();

      for (let nearIndex = index + 1; nearIndex < dots.length; nearIndex += 1) {
        const near = dots[nearIndex];
        const nearX = near.x * width + pointer.x * 44 * (0.55 + near.z * 0.8);
        const nearY = near.y * height + pointer.y * 28 * (0.55 + near.z * 0.8);
        const distance = Math.hypot(x - nearX, y - nearY);
        if (distance < 118) {
          context.strokeStyle = `rgba(103, 232, 249, ${0.12 * (1 - distance / 118)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(nearX, nearY);
          context.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  };

  draw();
}

function starsHtml(rating) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  return `${"&#9733;".repeat(safeRating)}${"&#9734;".repeat(5 - safeRating)}`;
}

function renderProjects() {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = state.projects.length
    ? state.projects
        .map(
          (project) => `
        <article class="project-card reveal visible">
          <img src="${escapeHtml(project.imageUrl)}" alt="${escapeHtml(project.title)} project preview" loading="lazy">
          <div class="project-body">
            <div class="project-meta">
              <span>${escapeHtml(project.category)}</span>
              <span>${escapeHtml(project.year)}</span>
            </div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <div class="tag-row">
              ${(project.stack || []).map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
            </div>
            <div class="hero-actions">
              <a class="button secondary dark" href="${escapeHtml(project.liveUrl || "#")}" target="_blank" rel="noopener">Live</a>
              <a class="button secondary dark" href="${escapeHtml(project.sourceUrl || "#")}" target="_blank" rel="noopener">Source</a>
            </div>
          </div>
        </article>`
        )
        .join("")
    : `<p class="section-note">No projects found yet.</p>`;
}

function renderReviews() {
  if (!reviewsGrid) return;

  reviewsGrid.innerHTML = state.reviews.length
    ? state.reviews
        .map(
          (review) => `
        <article class="review-card reveal visible">
          <div class="stars" aria-label="${escapeHtml(review.rating)} out of 5">${starsHtml(review.rating)}</div>
          <p>${escapeHtml(review.message)}</p>
          <footer>
            <div>
              <strong>${escapeHtml(review.name)}</strong>
              ${review.company ? `<small>${escapeHtml(review.company)}</small>` : ""}
            </div>
          </footer>
        </article>`
        )
        .join("")
    : `<p class="section-note">No reviews yet. Be the first to leave a review.</p>`;

  updateReviewStats();
}

function updateReviewStats() {
  const avgRatingEl = document.querySelector("#avg-rating");
  const reviewTotalEl = document.querySelector("#review-total");
  const avgStarsEl = document.querySelector("#avg-stars");
  const total = state.reviews.length;
  const average = total ? state.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total : 0;

  if (avgRatingEl) avgRatingEl.textContent = average.toFixed(1);
  if (reviewTotalEl) reviewTotalEl.textContent = String(total);
  if (avgStarsEl) avgStarsEl.innerHTML = starsHtml(Math.round(average));
}

function updateAuthUi() {
  const isAdmin = state.me?.role === "admin";
  loginForm?.classList.toggle("hidden", isAdmin);
  logoutButton?.classList.toggle("hidden", !isAdmin);
  adminPanel?.classList.toggle("hidden", !isAdmin);
}

async function loadProjects() {
  const result = await api("/api/projects");
  state.projects = Array.isArray(result.projects) ? result.projects : [];
  renderProjects();
}

async function loadReviews() {
  const result = await api("/api/reviews");
  state.reviews = Array.isArray(result) ? result : result.reviews || [];
  renderReviews();
}

async function loadMe() {
  const result = await api("/api/me");
  state.me = result.user;
  updateAuthUi();
}

async function loadAdmin() {
  if (state.me?.role !== "admin") return;
  const result = await api("/api/admin/dashboard");
  renderReports(result.reports);
  renderAdminProjects(result.projects || []);
  renderHireRequests(result.hireRequests || []);
  await loadAdminReviews();
}

function renderReports(reports = {}) {
  if (!reportCards) return;

  reportCards.innerHTML = [
    ["Projects", reports.projectCount || 0],
    ["Featured", reports.featuredCount || 0],
    ["Hire Requests", reports.hireRequestCount || 0],
    ["New Leads", reports.unreadHireCount || 0],
    ["Users", reports.userCount || 0],
  ]
    .map(([label, value]) => `<article class="report-card"><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderAdminProjects(projects) {
  if (!adminProjectsTable) return;

  adminProjectsTable.innerHTML = projects.length
    ? projects
        .map(
          (project) => `
        <tr>
          <td><strong>${escapeHtml(project.title)}</strong><br><small>${escapeHtml(project.category)} | ${escapeHtml(project.year)}</small></td>
          <td>${(project.stack || []).map(escapeHtml).join(", ")}</td>
          <td class="table-actions">
            <button class="button secondary dark" type="button" data-edit-project="${escapeHtml(project.id)}">Edit</button>
            <button class="button danger" type="button" data-delete-project="${escapeHtml(project.id)}">Delete</button>
          </td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="3">No projects yet.</td></tr>`;
}

function renderHireRequests(requests) {
  if (!hireRequestsTable) return;

  hireRequestsTable.innerHTML = requests.length
    ? requests
        .map((request) => {
          const features = Array.isArray(request.features) ? request.features.join(", ") : request.features || "";
          const packageText = request.package || request.budget || "Not selected";
          const projectType = request.projectType || "Project";

          return `
            <tr>
              <td><strong>${escapeHtml(request.name)}</strong><br><small>${escapeHtml(request.email)} | ${escapeHtml(request.phone)}</small></td>
              <td>
                <strong>${escapeHtml(packageText)} / ${escapeHtml(projectType)}</strong><br>
                ${escapeHtml(request.message)}<br>
                <small>${escapeHtml(request.company || "No company")}${features ? ` | ${escapeHtml(features)}` : ""}</small>
              </td>
              <td>
                <select class="status-select" data-hire-status="${escapeHtml(request.id)}">
                  ${["New", "Contacted", "In discussion", "Closed"].map((status) => `<option ${request.status === status ? "selected" : ""}>${status}</option>`).join("")}
                </select>
              </td>
              <td class="table-actions">
                <a class="button secondary dark" href="${escapeHtml(request.whatsappUrl)}" target="_blank" rel="noopener">WhatsApp</a>
                <a class="button secondary dark" href="${escapeHtml(request.emailUrl)}">Email</a>
                <button class="button danger" type="button" data-delete-hire="${escapeHtml(request.id)}">Delete</button>
              </td>
            </tr>`;
        })
        .join("")
    : `<tr><td colspan="4">No hire requests yet.</td></tr>`;
}

async function loadAdminReviews() {
  if (state.me?.role !== "admin" || !adminReviewsTable) return;
  const result = await api("/api/admin/reviews");
  renderAdminReviews(result.reviews || []);
}

function renderAdminReviews(reviews) {
  if (!adminReviewsTable) return;

  adminReviewsTable.innerHTML = reviews.length
    ? reviews
        .map(
          (review) => `
        <tr>
          <td><strong>${escapeHtml(review.name)}</strong>${review.company ? `<br><small>${escapeHtml(review.company)}</small>` : ""}</td>
          <td><span class="stars">${starsHtml(review.rating)}</span></td>
          <td>${escapeHtml(review.message)}</td>
          <td class="table-actions">
            <select class="status-select" data-review-status="${escapeHtml(review.id)}">
              <option value="true" ${review.approved ? "selected" : ""}>Approved</option>
              <option value="false" ${!review.approved ? "selected" : ""}>Pending</option>
            </select>
            <button class="button danger" type="button" data-delete-review="${escapeHtml(review.id)}">Delete</button>
          </td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="4">No reviews yet.</td></tr>`;
}

function fillProjectForm(id) {
  const project = state.projects.find((item) => item.id === id);
  if (!project || !projectForm) return;

  projectForm.elements.id.value = project.id;
  projectForm.elements.title.value = project.title;
  projectForm.elements.category.value = project.category;
  projectForm.elements.year.value = project.year;
  projectForm.elements.description.value = project.description;
  projectForm.elements.stack.value = (project.stack || []).join(", ");
  projectForm.elements.imageUrl.value = project.imageUrl;
  projectForm.elements.liveUrl.value = project.liveUrl || "";
  projectForm.elements.sourceUrl.value = project.sourceUrl || "";
  projectForm.elements.featured.checked = Boolean(project.featured);
  projectForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function initForms() {
  hireForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const result = await api("/api/hire", { method: "POST", body: JSON.stringify(formJson(hireForm)) });
      hireForm.reset();
      setStatus(hireForm, "Hire request saved. Send the message through WhatsApp or email.");
      if (hireWhatsappLink) hireWhatsappLink.href = result.request.whatsappUrl;
      if (hireEmailLink) hireEmailLink.href = result.request.emailUrl;
      hireDialog?.showModal();
      await loadAdmin();
    } catch (error) {
      setStatus(hireForm, error.message, true);
    }
  });

  reviewForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = formJson(reviewForm);
    if (!payload.rating) {
      setStatus(reviewForm, "Please select a rating.", true);
      return;
    }

    try {
      await api("/api/reviews", { method: "POST", body: JSON.stringify(payload) });
      reviewForm.reset();
      setStatus(reviewForm, "Thank you. Your review is waiting for approval.");
      reviewDialog?.showModal();
      await loadAdminReviews();
    } catch (error) {
      setStatus(reviewForm, error.message, true);
    }
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const result = await api("/api/login", { method: "POST", body: JSON.stringify(formJson(loginForm)) });
      state.me = result.user;
      loginForm.reset();
      setStatus(loginForm, "");
      updateAuthUi();
      await loadAdmin();
    } catch (error) {
      setStatus(loginForm, error.message, true);
    }
  });

  logoutButton?.addEventListener("click", async () => {
    await api("/api/logout", { method: "POST", body: "{}" });
    state.me = null;
    updateAuthUi();
  });

  projectForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = formJson(projectForm);
    const id = payload.id;
    payload.featured = projectForm.elements.featured.checked;
    delete payload.id;

    try {
      await api(id ? `/api/admin/projects/${encodeURIComponent(id)}` : "/api/admin/projects", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      projectForm.reset();
      setStatus(projectForm, "Project saved.");
      await loadProjects();
      await loadAdmin();
    } catch (error) {
      setStatus(projectForm, error.message, true);
    }
  });

  clearProjectForm?.addEventListener("click", () => {
    projectForm.reset();
    projectForm.elements.id.value = "";
    setStatus(projectForm, "");
  });
}

function initAdminActions() {
  document.addEventListener("click", async (event) => {
    const editProjectButton = event.target.closest("[data-edit-project]");
    const deleteProjectButton = event.target.closest("[data-delete-project]");
    const deleteHireButton = event.target.closest("[data-delete-hire]");
    const deleteReviewButton = event.target.closest("[data-delete-review]");

    if (editProjectButton) {
      fillProjectForm(editProjectButton.dataset.editProject);
      return;
    }

    if (deleteProjectButton && confirm("Delete this project?")) {
      await api(`/api/admin/projects/${encodeURIComponent(deleteProjectButton.dataset.deleteProject)}`, { method: "DELETE" });
      await loadProjects();
      await loadAdmin();
    }

    if (deleteHireButton && confirm("Delete this hire request?")) {
      await api(`/api/admin/hire-requests/${encodeURIComponent(deleteHireButton.dataset.deleteHire)}`, { method: "DELETE" });
      await loadAdmin();
    }

    if (deleteReviewButton && confirm("Delete this review?")) {
      await api(`/api/admin/reviews/${encodeURIComponent(deleteReviewButton.dataset.deleteReview)}`, { method: "DELETE" });
      await loadReviews();
      await loadAdminReviews();
    }
  });

  document.addEventListener("change", async (event) => {
    const hireStatusId = event.target.dataset.hireStatus;
    const reviewStatusId = event.target.dataset.reviewStatus;

    if (hireStatusId) {
      await api(`/api/admin/hire-requests/${encodeURIComponent(hireStatusId)}`, {
        method: "PUT",
        body: JSON.stringify({ status: event.target.value }),
      });
      await loadAdmin();
    }

    if (reviewStatusId) {
      await api(`/api/admin/reviews/${encodeURIComponent(reviewStatusId)}`, {
        method: "PUT",
        body: JSON.stringify({ approved: event.target.value === "true" }),
      });
      await loadReviews();
      await loadAdminReviews();
    }
  });
}

window.selectPackage = (packageName) => {
  const packageSelect = document.querySelector("#package-select");
  if (packageSelect) packageSelect.value = packageName;
  hireForm?.scrollIntoView({ behavior: "smooth", block: "start" });
};

async function init() {
  initHeader();
  initReveal();
  initProfileTilt();
  initHeroCanvas();
  initForms();
  initAdminActions();

  await Promise.all([loadProjects(), loadReviews(), loadMe()]);
  await loadAdmin();
}

init().catch((error) => {
  console.error(error);
  if (projectsGrid) projectsGrid.innerHTML = `<p class="section-note">Could not load portfolio: ${escapeHtml(error.message)}</p>`;
});
