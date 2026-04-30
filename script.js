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
const hireWhatsappLink = document.querySelector("#hire-whatsapp-link");
const hireEmailLink = document.querySelector("#hire-email-link");
const reviewsGrid = document.getElementById("reviews-grid");
const reviewForm = document.getElementById("review-form");
const reviewDialog = document.getElementById("review-dialog");
const adminReviewsTable = document.getElementById("admin-reviews-table");
let state = { projects: [], me: null, reviews: [] };
const escapeHtml = (v) => String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
const api = async (path, opts={}) => { const r = await fetch(path, {headers:{"Content-Type":"application/json",...(opts.headers||{})},credentials:"same-origin",...opts}); const t = await r.text(); const d = t ? JSON.parse(t) : {}; if(!r.ok) throw new Error(d.error||"Failed"); return d; };
const formJson = (f) => Object.fromEntries(new FormData(f).entries());
const setStatus = (f, msg, err=false) => { const s = f?.querySelector(".form-status"); if(s){s.textContent=msg;s.classList.toggle("error",err);} };
function initHeader(){const sh=()=>header.classList.toggle("scrolled",window.scrollY>20);sh();window.addEventListener("scroll",sh);navToggle.addEventListener("click",()=>{const o=nav.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(o));});nav.addEventListener("click",(e)=>{if(e.target.matches("a")){nav.classList.remove("open");navToggle.setAttribute("aria-expanded","false");}});}
function initReveal(){const o=new IntersectionObserver((e)=>{e.forEach((i)=>{if(i.isIntersecting)i.target.classList.add("visible");});},{threshold:0.14});document.querySelectorAll(".reveal").forEach((e)=>o.observe(e));}
function initProfileTilt(){const c=document.querySelector("#profile-card");if(!c)return;c.addEventListener("pointermove",(e)=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-0.5;const y=(e.clientY-r.top)/r.height-0.5;c.style.transform=`perspective(1000px) rotateY(${x*16}deg) rotateX(${-y*12}deg) translateY(-4px)`;});c.addEventListener("pointerleave",()=>{c.style.transform="";});}
