const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const os = require("os");

const PORT = Number(process.env.PORT || 5678);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "umarxgamer04@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PortfolioAdmin2026!";
const CONTACT_PHONE = process.env.CONTACT_PHONE || "+94 77 181 3023";
const CONTACT_WHATSAPP = process.env.CONTACT_WHATSAPP || "94771813023";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "umarxgamer04@gmail.com";
let DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
let DB_FILE = path.join(DATA_DIR, "database.json");
const CV_FILE = process.env.CV_FILE || path.join(__dirname, "assets", "Umar CV.pdf");
const PROFILE_IMAGE_FILE = process.env.PROFILE_IMAGE_FILE || path.join(__dirname, "assets", "my profile image.jpeg");
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const seedProjects = [
  {
    id: "project_coffee",
    title: "Aurora Table Restaurant",
    category: "Full-stack",
    year: "2026",
    description: "A full-stack restaurant website with user authentication, online ordering, WhatsApp integration, and an admin dashboard for managing orders and menu items.",
    stack: ["Node.js", "HTML", "CSS", "JavaScript", "MongoDB", "Express.js"],
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://aurora-table-resturent.onrender.com/",
    sourceUrl: "#",
    featured: true,
  },
  {
    id: "project_gym_management",
    title: "Gym Management System",
    category: "Web app",
    year: "2026",
    description: "A management system concept for members, packages, and daily operations with admin-oriented workflows.",
    stack: ["JavaScript", "Dashboard UI", "CRUD"],
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "#",
    sourceUrl: "#",
    featured: true,
  },
  {
    id: "project_gym_website",
    title: "Gym Website",
    category: "Frontend",
    year: "2026",
    description: "A responsive fitness website with service sections, membership prompts, and strong visual branding.",
    stack: ["HTML", "CSS", "Responsive Design"],
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "#",
    sourceUrl: "#",
    featured: false,
  },
  {
    id: "project_network_lab",
    title: "Cisco Packet Tracer Network Lab",
    category: "Networking",
    year: "2026",
    description: "Network topology exercises covering device configuration, routing basics, and troubleshooting.",
    stack: ["Cisco", "Networking", "Packet Tracer"],
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "#",
    sourceUrl: "#",
    featured: false,
  },
  {
    id: "project_bean_bloom",
    title: "Bean & Bloom Coffee",
    category: "Full-stack",
    year: "2026",
    description: "A full-stack coffee shop website with authentication, online ordering, WhatsApp integration, and an admin dashboard for managing orders and the menu.",
    stack: ["Node.js", "HTML", "CSS", "JavaScript", "SQL"],
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://build-coffee-shop-website.onrender.com/",
    sourceUrl: "https://build-coffee-shop-website.onrender.com/",
    featured: false,
  },
  {
    id: "project_veltro",
    title: "Veltro Mens Fashion",
    category: "Website",
    year: "2026",
    description: "A modern men's fashion website with a clean UI, responsive design, and elegant product showcase to enhance brand identity and user experience.",
    stack: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    imageUrl: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://veltro-men.vercel.app/",
    sourceUrl: "https://veltro-men.vercel.app/",
    featured: false,
  },
  {
    id: "project_lumina_coffee",
    title: "Lumina Coffee",
    category: "Full-stack",
    year: "2026",
    description: "A premium full-stack coffee shop website with authentication, online ordering, table booking, WhatsApp integration, and admin dashboard.",
    stack: ["Node.js", "Express.js", "MongoDB", "HTML", "CSS", "JavaScript"],
    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://coffee-shop-one-swart.vercel.app/",
    sourceUrl: "https://coffee-shop-one-swart.vercel.app/",
    featured: false,
  },
  {
    id: "project_creative_brandings",
    title: "Creative Brandings Studio",
    category: "Website",
    year: "2026",
    description: "A modern branding studio website with a creative UI, service showcase, portfolio section, and responsive design.",
    stack: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    imageUrl: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://creativebrandings.netlify.app/",
    sourceUrl: "https://creativebrandings.netlify.app/",
    featured: false,
  },
];

const seedReviews = [
  {
    id: "review1",
    name: "Ahmed Khan",
    company: "TechStart Lanka",
    approved: true,
    rating: 5,
    message: "Exceptional work on our restaurant website. Fast delivery and great communication throughout the project.",
    createdAt: "2026-04-25T10:00:00Z",
  },
  {
    id: "review2",
    name: "Sarah Fernando",
    company: "Fashion Forward",
    approved: true,
    rating: 5,
    message: "Umar built us a stunning e-commerce platform. The attention to detail was impressive and the site works flawlessly.",
    createdAt: "2026-04-26T14:30:00Z",
  },
  {
    id: "review3",
    name: "Ravi Silva",
    company: "FitLife Gym",
    approved: true,
    rating: 4,
    message: "Great developer. Built a complete gym management system with all the features we needed. Highly recommended.",
    createdAt: "2026-04-27T09:15:00Z",
  },
  {
    id: "review4",
    name: "Nimal Perera",
    company: "Coffee House Colombo",
    approved: true,
    rating: 5,
    message: "Professional service from start to finish. The coffee shop website exceeded our expectations.",
    createdAt: "2026-04-28T16:45:00Z",
  },
  {
    id: "review5",
    name: "Priya Jayawardena",
    company: "Creative Agency",
    approved: true,
    rating: 5,
    message: "Amazing portfolio. The animated elements really make the websites stand out.",
    createdAt: "2026-04-29T11:20:00Z",
  },
  {
    id: "review6",
    name: "Kasun Dissanayake",
    company: "Printy HUB",
    approved: true,
    rating: 5,
    message: "Quick turnaround and excellent quality. Our new website has already brought us more customers.",
    createdAt: "2026-04-30T08:00:00Z",
  },
];

function ensureDataDir() {
  const candidates = [DATA_DIR, path.join(__dirname, "data"), path.join(os.tmpdir(), "umar-portfolio-data")];
  for (const candidate of candidates) {
    try {
      if (!fs.existsSync(candidate)) fs.mkdirSync(candidate, { recursive: true });
      DATA_DIR = candidate;
      DB_FILE = path.join(DATA_DIR, "database.json");
      return;
    } catch (error) {
      console.warn(`Could not use data directory "${candidate}" (${error.code}).`);
    }
  }
  throw new Error("No writable data directory is available.");
}

function ensureDb() {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    writeDb({
      users: [],
      sessions: [],
      projects: seedProjects,
      hireRequests: [],
      reviews: seedReviews,
    });
  }

  const db = readDb();
  const adminHash = hashPassword(ADMIN_PASSWORD);
  const admin = db.users.find((user) => user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  if (admin) {
    admin.name = "Umar Admin";
    admin.phone = CONTACT_PHONE;
    admin.role = "admin";
    admin.passwordHash = adminHash;
  } else {
    db.users.push({
      id: crypto.randomUUID(),
      name: "Umar Admin",
      email: ADMIN_EMAIL,
      phone: CONTACT_PHONE,
      role: "admin",
      passwordHash: adminHash,
      createdAt: new Date().toISOString(),
    });
  }

  if (!Array.isArray(db.projects) || !db.projects.length) db.projects = seedProjects;
  if (!Array.isArray(db.hireRequests)) db.hireRequests = [];
  if (!Array.isArray(db.reviews)) db.reviews = seedReviews;
  writeDb(db);
}

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8").replace(/^\uFEFF/, ""));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [method, salt, storedHash] = String(passwordHash || "").split(":");
  if (method !== "scrypt" || !salt || !storedHash) return false;
  const checkHash = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), checkHash);
}

function json(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8", ...extraHeaders });
  res.end(JSON.stringify(payload));
}

function error(res, statusCode, message) {
  json(res, statusCode, { error: message });
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function publicUser(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
}

function currentUser(req, db) {
  const sessionId = parseCookies(req).sessionId;
  if (!sessionId) return null;
  const session = db.sessions.find((item) => item.id === sessionId);
  if (!session || new Date(session.expiresAt).getTime() < Date.now()) return null;
  return db.users.find((user) => user.id === session.userId) || null;
}

function requireAdmin(req, res, db) {
  const user = currentUser(req, db);
  if (!user || user.role !== "admin") {
    error(res, 403, "Admin login required");
    return null;
  }
  return user;
}

function createSession(db, userId) {
  const session = {
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
  db.sessions = db.sessions.filter((item) => new Date(item.expiresAt).getTime() > Date.now());
  db.sessions.push(session);
  return session;
}

function setSessionCookie(session) {
  return `sessionId=${encodeURIComponent(session.id)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`;
}

function clearSessionCookie() {
  return "sessionId=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
}

function missing(payload, fields) {
  return fields.find((field) => payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "");
}

function profile() {
  return {
    name: "Umar",
    role: "Full-stack Web Developer",
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE,
    whatsapp: CONTACT_WHATSAPP,
    location: "Sri Lanka",
    summary: "I build modern websites, dashboards, admin systems, booking flows, and creative frontends with animation and practical backend logic.",
  };
}

function hireMessage(request) {
  return [
    "Portfolio hire request",
    `Name: ${request.name}`,
    `Company: ${request.company || "Not provided"}`,
    `Email: ${request.email}`,
    `Phone: ${request.phone}`,
    `Package: ${request.package || request.budget || "Not provided"}`,
    `Project type: ${request.projectType || "Not provided"}`,
    `Features: ${Array.isArray(request.features) && request.features.length ? request.features.join(", ") : "Not provided"}`,
    `Additional requirements: ${request.additionalFeatures || "Not provided"}`,
    `Project: ${request.message}`,
  ].join("\n");
}

function withContactLinks(request) {
  const text = hireMessage(request);
  const subject = encodeURIComponent(`Hire request from ${request.name}`);
  return {
    ...request,
    whatsappUrl: `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(text)}`,
    emailUrl: `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(text)}`,
  };
}

function projectPayload(payload, existing = {}) {
  return {
    id: existing.id || crypto.randomUUID(),
    title: String(payload.title ?? existing.title ?? "").trim(),
    category: String(payload.category ?? existing.category ?? "").trim(),
    year: String(payload.year ?? existing.year ?? "").trim(),
    description: String(payload.description ?? existing.description ?? "").trim(),
    stack: Array.isArray(payload.stack)
      ? payload.stack.map(String).map((item) => item.trim()).filter(Boolean)
      : String(payload.stack ?? existing.stack?.join(", ") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    imageUrl: String(payload.imageUrl ?? existing.imageUrl ?? "").trim(),
    liveUrl: String(payload.liveUrl ?? existing.liveUrl ?? "#").trim(),
    sourceUrl: String(payload.sourceUrl ?? existing.sourceUrl ?? "#").trim(),
    featured: Boolean(payload.featured ?? existing.featured ?? false),
    updatedAt: new Date().toISOString(),
    createdAt: existing.createdAt || new Date().toISOString(),
  };
}

function reports(db) {
  return {
    projectCount: db.projects.length,
    featuredCount: db.projects.filter((project) => project.featured).length,
    hireRequestCount: db.hireRequests.length,
    unreadHireCount: db.hireRequests.filter((request) => request.status === "New").length,
    userCount: db.users.length,
  };
}

async function handleApi(req, res, pathname) {
  const db = readDb();

  if (req.method === "GET" && pathname === "/api/profile") return json(res, 200, { profile: profile() });
  if (req.method === "GET" && pathname === "/api/projects") return json(res, 200, { projects: db.projects });
  if (req.method === "GET" && pathname === "/api/me") return json(res, 200, { user: publicUser(currentUser(req, db)) });

  if (req.method === "POST" && pathname === "/api/login") {
    const payload = await readBody(req);
    const field = missing(payload, ["email", "password"]);
    if (field) return error(res, 400, `${field} is required`);
    const user = db.users.find((item) => item.email.toLowerCase() === String(payload.email).trim().toLowerCase());
    if (!user || !verifyPassword(String(payload.password), user.passwordHash)) return error(res, 401, "Invalid email or password");
    const session = createSession(db, user.id);
    writeDb(db);
    return json(res, 200, { user: publicUser(user) }, { "Set-Cookie": setSessionCookie(session) });
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    const sessionId = parseCookies(req).sessionId;
    if (sessionId) {
      db.sessions = db.sessions.filter((session) => session.id !== sessionId);
      writeDb(db);
    }
    return json(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
  }

  if (req.method === "POST" && pathname === "/api/hire") {
    const payload = await readBody(req);
    const field = missing(payload, ["name", "email", "phone", "message"]);
    if (field) return error(res, 400, `${field} is required`);
    const request = {
      id: crypto.randomUUID(),
      name: String(payload.name).trim(),
      company: String(payload.company || "").trim(),
      email: String(payload.email).trim(),
      phone: String(payload.phone).trim(),
      budget: String(payload.budget || "").trim(),
      package: String(payload.package || payload.budget || "").trim(),
      projectType: String(payload.projectType || "").trim(),
      features: Array.isArray(payload.features) ? payload.features.map(String).map((item) => item.trim()).filter(Boolean) : [],
      additionalFeatures: String(payload.additionalFeatures || "").trim(),
      message: String(payload.message).trim(),
      status: "New",
      createdAt: new Date().toISOString(),
    };
    db.hireRequests.push(request);
    writeDb(db);
    return json(res, 201, { request: withContactLinks(request) });
  }

  
  if (req.method === "GET" && pathname === "/api/reviews") {
    const db = readDb();
    return json(res, 200, (db.reviews || []).filter(r => r.approved));
  }

  if (req.method === "POST" && pathname === "/api/reviews") {
    const payload = await readBody(req);
    const field = missing(payload, ["name", "rating", "message"]);
    if (field) return error(res, 400, field + " is required");
    const db = readDb();
    if (!db.reviews) db.reviews = [];
    const review = {
      id: crypto.randomUUID(),
      name: String(payload.name).trim(),
      company: String(payload.company || "").trim(),
      rating: parseInt(payload.rating) || 5,
      message: String(payload.message).trim(),
      approved: false,
      createdAt: new Date().toISOString()
    };
    db.reviews.push(review);
    writeDb(db);
    return json(res, 201, { review });
  }

  if (req.method === "GET" && pathname === "/api/admin/reviews") {
    if (!requireAdmin(req, res, db)) return;
    const adminDb = readDb();
    return json(res, 200, { reviews: (adminDb.reviews || []).slice().reverse() });
  }

  const reviewMatch = pathname.match(/^\/api\/admin\/reviews\/([^/]+)$/);
  if (reviewMatch) {
    if (!requireAdmin(req, res, db)) return;
    const id = decodeURIComponent(reviewMatch[1]);
    const reviewDb = readDb();
    const review = (reviewDb.reviews || []).find(item => item.id === id);
    if (!review) return error(res, 404, "Review not found");
    if (req.method === "PUT") {
      const payload = await readBody(req);
      if (typeof payload.approved !== "undefined") review.approved = Boolean(payload.approved);
      writeDb(reviewDb);
      return json(res, 200, { review });
    }
    if (req.method === "DELETE") {
      reviewDb.reviews = (reviewDb.reviews || []).filter(item => item.id !== id);
      writeDb(reviewDb);
      return json(res, 200, { ok: true });
    }
  }

  if (req.method === "GET" && pathname === "/api/admin/dashboard") {
    if (!requireAdmin(req, res, db)) return;
    return json(res, 200, {
      reports: reports(db),
      projects: db.projects,
      hireRequests: db.hireRequests.map(withContactLinks).reverse(),
      users: db.users.map(publicUser),
    });
  }

  if (req.method === "POST" && pathname === "/api/admin/projects") {
    if (!requireAdmin(req, res, db)) return;
    const payload = await readBody(req);
    const field = missing(payload, ["title", "category", "year", "description", "stack", "imageUrl"]);
    if (field) return error(res, 400, `${field} is required`);
    const project = projectPayload(payload);
    db.projects.push(project);
    writeDb(db);
    return json(res, 201, { project });
  }

  const projectMatch = pathname.match(/^\/api\/admin\/projects\/([^/]+)$/);
  if (projectMatch) {
    if (!requireAdmin(req, res, db)) return;
    const id = decodeURIComponent(projectMatch[1]);
    const project = db.projects.find((item) => item.id === id);
    if (!project) return error(res, 404, "Project not found");
    if (req.method === "PUT") {
      const payload = await readBody(req);
      const next = projectPayload(payload, project);
      Object.assign(project, next);
      writeDb(db);
      return json(res, 200, { project });
    }
    if (req.method === "DELETE") {
      db.projects = db.projects.filter((item) => item.id !== id);
      writeDb(db);
      return json(res, 200, { ok: true });
    }
  }

  const hireMatch = pathname.match(/^\/api\/admin\/hire-requests\/([^/]+)$/);
  if (hireMatch) {
    if (!requireAdmin(req, res, db)) return;
    const id = decodeURIComponent(hireMatch[1]);
    const request = db.hireRequests.find((item) => item.id === id);
    if (!request) return error(res, 404, "Hire request not found");
    if (req.method === "PUT") {
      const payload = await readBody(req);
      request.status = String(payload.status || request.status).trim();
      writeDb(db);
      return json(res, 200, { request: withContactLinks(request) });
    }
    if (req.method === "DELETE") {
      db.hireRequests = db.hireRequests.filter((item) => item.id !== id);
      writeDb(db);
      return json(res, 200, { ok: true });
    }
  }

  return error(res, 404, "API route not found");
}

function serveStatic(req, res, pathname) {
  if (pathname === "/cv") {
    return serveCv(res);
  }

  if (pathname === "/profile-image") {
    return serveProfileImage(res);
  }

  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(__dirname, requestedPath));
  if (!filePath.startsWith(__dirname) || filePath.includes(`${path.sep}data${path.sep}`)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(filePath, (readError, content) => {
    if (readError) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(content);
  });
}

function serveProfileImage(res) {
  fs.readFile(PROFILE_IMAGE_FILE, (readError, content) => {
    if (readError) {
      error(res, 404, "Profile image not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600",
      "Content-Length": content.length,
    });
    res.end(content);
  });
}

function serveCv(res) {
  fs.readFile(CV_FILE, (readError, content) => {
    if (readError) {
      error(res, 404, "CV file not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Umar-CV.pdf"',
      "Content-Length": content.length,
    });
    res.end(content);
  });
}

ensureDb();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }
    serveStatic(req, res, decodeURIComponent(url.pathname));
  } catch (requestError) {
    error(res, 500, requestError.message || "Server error");
  }
});

server.listen(PORT, () => {
  console.log(`Portfolio website running at http://localhost:${PORT}`);
  console.log(`Admin email: ${ADMIN_EMAIL}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
