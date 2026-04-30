import * as THREE from "three";

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
const hireDialogText = document.querySelector("#hire-dialog-text");
const hireWhatsappLink = document.querySelector("#hire-whatsapp-link");
const hireEmailLink = document.querySelector("#hire-email-link");

let state = { projects: [], me: null };

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

const formJson = (form) => Object.fromEntries(new FormData(form).entries());

const setStatus = (form, message, isError = false) => {
  const status = form.querySelector(".form-status");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("error", isError);
};

function initHeader() {
  const setHeaderState = () => header.classList.toggle("scrolled", window.scrollY > 20);
  setHeaderState();
  window.addEventListener("scroll", setHeaderState);
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.14 }
  );
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
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

function initThreeHero() {
  const canvas = document.querySelector("#hero-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.2, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x8cf5ff,
    metalness: 0.35,
    roughness: 0.28,
    wireframe: true,
  });

  for (let index = 0; index < 9; index += 1) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 5);
    mesh.scale.setScalar(0.35 + Math.random() * 0.55);
    mesh.material.color.set(index % 2 ? 0xa3e635 : 0x06b6d4);
    group.add(mesh);
  }

  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(900);
  for (let index = 0; index < positions.length; index += 3) {
    positions[index] = (Math.random() - 0.5) * 16;
    positions[index + 1] = (Math.random() - 0.5) * 10;
    positions[index + 2] = (Math.random() - 0.5) * 10;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.62 })
  );
  scene.add(particles);

  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const light = new THREE.PointLight(0x8cf5ff, 18, 30);
  light.position.set(4, 5, 6);
  scene.add(light);

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", resize);

  const animate = () => {
    requestAnimationFrame(animate);
    group.rotation.y += 0.003;
    group.rotation.x += 0.0015;
    group.position.x += (pointer.x * 0.35 - group.position.x) * 0.03;
    group.position.y += (-pointer.y * 0.22 - group.position.y) * 0.03;
    particles.rotation.y -= 0.0009;
    renderer.render(scene, camera);
  };
  animate();
}

function renderProjects() {
  projectsGrid.innerHTML = state.projects
    .map(
      (project) => `
      <article class="project-card reveal visible">
        <img src="${escapeHtml(project.imageUrl)}" alt="${escapeHtml(project.title)} project preview">
        <div class="project-body">
          <div class="project-meta"><span>${escapeHtml(project.category)}</span><span>${escapeHtml(project.year)}</span></div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <div class="tag-row">${project.stack.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>
          <div class="hero-actions">
            <a class="button secondary dark" href="${escapeHtml(project.liveUrl || "#")}">Live</a>
            <a class="button secondary dark" href="${escapeHtml(project.sourceUrl || "#")}">Source</a>
          </div>
        </div>
      </article>`
    )
    .join("");
}

function updateAuthUi() {
  const isAdmin = state.me?.role === "admin";
  loginForm.classList.toggle("hidden", isAdmin);
  logoutButton.classList.toggle("hidden", !isAdmin);
  adminPanel.classList.toggle("hidden", !isAdmin);
}

async function loadProjects() {
  const result = await api("/api/projects");
  state.projects = result.projects;
  renderProjects();
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
  renderAdminProjects(result.projects);
  renderHireRequests(result.hireRequests);
}

function renderReports(reports) {
  reportCards.innerHTML = [
    ["Projects", reports.projectCount],
    ["Featured", reports.featuredCount],
    ["Hire Requests", reports.hireRequestCount],
    ["New Leads", reports.unreadHireCount],
    ["Users", reports.userCount],
  ]
    .map(([label, value]) => `<article class="report-card"><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderAdminProjects(projects) {
  adminProjectsTable.innerHTML = projects.length
    ? projects
        .map(
          (project) => `
          <tr>
            <td><strong>${escapeHtml(project.title)}</strong><br><small>${escapeHtml(project.category)} | ${escapeHtml(project.year)}</small></td>
            <td>${project.stack.map(escapeHtml).join(", ")}</td>
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
  hireRequestsTable.innerHTML = requests.length
    ? requests
        .map(
          (request) => `
          <tr>
            <td><strong>${escapeHtml(request.name)}</strong><br><small>${escapeHtml(request.email)} | ${escapeHtml(request.phone)}</small></td>
            <td>${escapeHtml(request.message)}<br><small>${escapeHtml(request.company || "No company")} | ${escapeHtml(request.budget || "No budget")}</small></td>
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
          </tr>`
        )
        .join("")
    : `<tr><td colspan="4">No hire requests yet.</td></tr>`;
}

hireForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const result = await api("/api/hire", { method: "POST", body: JSON.stringify(formJson(hireForm)) });
    hireForm.reset();
    setStatus(hireForm, "Hire request saved. Send the message through WhatsApp or email.");
    hireDialogText.textContent = "Your request is saved. Choose WhatsApp or email to send the message directly.";
    hireWhatsappLink.href = result.request.whatsappUrl;
    hireEmailLink.href = result.request.emailUrl;
    hireDialog.showModal();
    await loadAdmin();
  } catch (error) {
    setStatus(hireForm, error.message, true);
  }
});

loginForm.addEventListener("submit", async (event) => {
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

logoutButton.addEventListener("click", async () => {
  await api("/api/logout", { method: "POST", body: "{}" });
  state.me = null;
  updateAuthUi();
});

projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = formJson(projectForm);
  const id = payload.id;
  payload.featured = projectForm.elements.featured.checked;
  delete payload.id;
  try {
    await api(id ? `/api/admin/projects/${id}` : "/api/admin/projects", {
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

clearProjectForm.addEventListener("click", () => {
  projectForm.reset();
  projectForm.elements.id.value = "";
  setStatus(projectForm, "");
});

document.addEventListener("click", async (event) => {
  const editProjectId = event.target.dataset.editProject;
  const deleteProjectId = event.target.dataset.deleteProject;
  const deleteHireId = event.target.dataset.deleteHire;

  if (editProjectId) fillProjectForm(editProjectId);

  if (deleteProjectId && confirm("Delete this project?")) {
    await api(`/api/admin/projects/${deleteProjectId}`, { method: "DELETE" });
    await loadProjects();
    await loadAdmin();
  }

  if (deleteHireId && confirm("Delete this hire request?")) {
    await api(`/api/admin/hire-requests/${deleteHireId}`, { method: "DELETE" });
    await loadAdmin();
  }
});

document.addEventListener("change", async (event) => {
  const hireStatusId = event.target.dataset.hireStatus;
  if (!hireStatusId) return;
  await api(`/api/admin/hire-requests/${hireStatusId}`, {
    method: "PUT",
    body: JSON.stringify({ status: event.target.value }),
  });
  await loadAdmin();
});

function fillProjectForm(id) {
  const project = state.projects.find((item) => item.id === id);
  if (!project) return;
  projectForm.elements.id.value = project.id;
  projectForm.elements.title.value = project.title;
  projectForm.elements.category.value = project.category;
  projectForm.elements.year.value = project.year;
  projectForm.elements.description.value = project.description;
  projectForm.elements.stack.value = project.stack.join(", ");
  projectForm.elements.imageUrl.value = project.imageUrl;
  projectForm.elements.liveUrl.value = project.liveUrl;
  projectForm.elements.sourceUrl.value = project.sourceUrl;
  projectForm.elements.featured.checked = Boolean(project.featured);
  projectForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function init() {
  initHeader();
  initReveal();
  initProfileTilt();
  initThreeHero();
  await loadProjects();
  await loadMe();
  await loadAdmin();
}

init().catch((error) => {
  projectsGrid.innerHTML = `<p>Could not load portfolio: ${escapeHtml(error.message)}</p>`;
});

// Package selection function
window.selectPackage = function(package) {
  const packageSelect = document.getElementById('package-select');
  if (packageSelect) {
    packageSelect.value = package;
    packageSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// Star rating interaction
document.addEventListener('DOMContentLoaded', function() {
  const starLabels = document.querySelectorAll('.star-rating label');
  starLabels.forEach((label, index) => {
    label.addEventListener('click', function() {
      const rating = 5 - index;
      const radios = document.querySelectorAll('.star-rating input');
      radios.forEach(r => r.checked = false);
      radios[5 - rating].checked = true;
      highlightStars(rating);
    });
  });
});

function highlightStars(rating) {
  const labels = document.querySelectorAll('.star-rating label');
  labels.forEach((label, index) => {
    if (index < 6 - rating) {
      label.style.color = '#f59e0b';
    } else {
      label.style.color = '#d1d5db';
    }
  });
}

// Reviews state
let reviews = [];

const reviewsGrid = document.getElementById('reviews-grid');
const reviewForm = document.getElementById('review-form');
const reviewDialog = document.getElementById('review-dialog');

async function loadReviews() {
  try {
    reviews = await api('/api/reviews');
    renderReviews();
    updateReviewStats();
  } catch (error) {
    console.log('Could not load reviews');
  }
}

function renderReviews() {
  if (!reviewsGrid) return;
  const approvedReviews = reviews.filter(r => r.approved);
  if (approvedReviews.length === 0) {
    reviewsGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--muted);">No reviews yet. Be the first to leave a review!</p>';
    return;
  }
  reviewsGrid.innerHTML = approvedReviews.map(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    return `
      <article class="review-card">
        <div class="stars">${stars}</div>
        <p>${escapeHtml(review.message)}</p>
        <footer>
          <div>
            <strong>${escapeHtml(review.name)}</strong>
            ${review.company ? `<small>${escapeHtml(review.company)}</small>` : ''}
          </div>
        </footer>
      </article>
    `;
  }).join('');
}

function updateReviewStats() {
  const approvedReviews = reviews.filter(r => r.approved);
  const avgRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1) 
    : '0.0';
  
  const avgRatingEl = document.getElementById('avg-rating');
  const reviewTotalEl = document.getElementById('review-total');
  const avgStarsEl = document.getElementById('avg-stars');
  
  if (avgRatingEl) avgRatingEl.textContent = avgRating;
  if (reviewTotalEl) reviewTotalEl.textContent = approvedReviews.length;
  if (avgStarsEl) avgStarsEl.textContent = '★'.repeat(Math.round(avgRating));
}

// Review form submission
if (reviewForm) {
  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    const rating = formData.get('rating');
    if (!rating) {
      setStatus(reviewForm, 'Please select a rating', true);
      return;
    }
    const payload = {
      name: formData.get('name'),
      company: formData.get('company'),
      rating: parseInt(rating),
      message: formData.get('message')
    };
    try {
      await api('/api/reviews', { method: 'POST', body: JSON.stringify(payload) });
      reviewForm.reset();
      setStatus(reviewForm, 'Thank you! Your review has been submitted.');
      if (reviewDialog) reviewDialog.showModal();
    } catch (error) {
      setStatus(reviewForm, error.message, true);
    }
  });
}

// Admin reviews management
const adminReviewsTable = document.getElementById('admin-reviews-table');

async function loadAdminReviews() {
  try {
    const data = await api('/api/admin/reviews');
    renderAdminReviews(data.reviews);
  } catch (error) {
    console.log('Could not load admin reviews');
  }
}

function renderAdminReviews(reviewList) {
  if (!adminReviewsTable) return;
  adminReviewsTable.innerHTML = reviewList && reviewList.length > 0
    ? reviewList.map(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        return `
          <tr>
            <td>${escapeHtml(review.name)}${review.company ? `<br><small>${escapeHtml(review.company)}</small>` : ''}</td>
            <td><span class="stars">${stars}</span></td>
            <td>${escapeHtml(review.message)}</td>
            <td>
              <select class="status-select" data-review-status="${escapeHtml(review.id)}">
                <option ${review.approved ? 'selected' : ''} value="true">Approved</option>
                <option ${!review.approved ? 'selected' : ''} value="false">Pending</option>
              </select>
              <button class="button danger" type="button" data-delete-review="${escapeHtml(review.id)}">Delete</button>
            </td>
          </tr>
        `;
      }).join('')
    : '<tr><td colspan="4">No reviews yet.</td></tr>';
}

// Review status change
document.addEventListener('change', async (event) => {
  const reviewStatusId = event.target.dataset.reviewStatus;
  if (!reviewStatusId) return;
  await api(`/api/admin/reviews/${reviewStatusId}`, {
    method: 'PUT',
    body: JSON.stringify({ approved: event.target.value === 'true' })
  });
  await loadAdminReviews();
  await loadReviews();
});

// Review deletion
document.addEventListener('click', async (event) => {
  const deleteReviewId = event.target.dataset.deleteReview;
  if (!deleteReviewId) return;
  if (confirm('Delete this review?')) {
    await api(`/api/admin/reviews/${deleteReviewId}`, { method: 'DELETE' });
    await loadAdminReviews();
    await loadReviews();
  }
});

// Update loadMe to also load reviews
const originalLoadMe = typeof loadMe === 'function' ? loadMe : null;

async function loadMe() {
  if (originalLoadMe) await originalLoadMe();
  await loadReviews();
}

// Update loadAdmin to also load reviews
const originalLoadAdmin = typeof loadAdmin === 'function' ? loadAdmin : null;

async function loadAdmin() {
  if (originalLoadAdmin) await originalLoadAdmin();
  await loadAdminReviews();
}

// Init reviews on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadReviews, 500);
  });
} else {
  setTimeout(loadReviews, 500);
}
