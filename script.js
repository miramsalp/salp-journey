let posts = [];
let currentPage = 1;
const postsPerPage = 4;

// DOM elements
const listEl = document.getElementById("post-list");
const contentEl = document.getElementById("post-content");
const paginationEl = document.getElementById("pagination");
const toggleBtn = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");

// Theme icons
const sunPath = "M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708";
const moonPath = "M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286";


// Fetch and render posts
function fetchPosts() {
  fetch("posts/index.json")
    .then((res) => res.json())
    .then((data) => {
      posts = data;
      renderPostList();
    })
    .catch((err) => console.error("Failed to load posts:", err));
}

function renderPostList() {
  listEl.classList.remove("d-none");
  contentEl.classList.add("d-none");
  listEl.innerHTML = "";

  const start = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(start, start + postsPerPage);

  currentPosts.forEach((post) => {
    const el = document.createElement("div");
    el.className = "card mb-4 p-4 shadow-sm";

    const imageHtml = post.image
      ? `<div class="col-md-4 order-1 order-md-2 mb-3 mb-md-0">
          <img src="${post.image}" class="img-fluid rounded w-100 h-100 object-fit-cover" style="max-height: 180px;" alt="${post.title}" onerror="this.parentElement.remove();">
        </div>`
      : "";

    el.innerHTML = `
      <div class="row g-0 flex-column flex-md-row">
        <div class="col-md-8 order-2 order-md-1">
          <div class="card-body p-0 pe-md-3 pt-3 pt-md-0">
            <h4 class="fw-bold tcy" onclick="renderPost('${post.id}')">${post.title}</h4>
            <div class="text-muted mb-2">
              <img src="./assets/icons/calendar4.svg"/> ${post.date} ${post.update ? `| 🔁 ${post.update}` : ""}
            </div>
            <div class="mb-2">${renderTags(post.tags)}</div>
            <p class="text-muted">${post.wordCount} words • ${post.readTime} min</p>
            <button class="btn btn-outline-primary btn-sm" onclick="renderPost('${post.id}')">Read →</button>
          </div>
        </div>
        ${imageHtml}
      </div>
    `;
    listEl.appendChild(el);
  });

  renderPagination();
}

function renderPost(id) {
  const post = posts.find((p) => p.id === id);
  listEl.classList.add("d-none");
  paginationEl.innerHTML = "";
  contentEl.classList.remove("d-none");

  fetch(`posts/${id}.json`)
    .then((res) => res.json())
    .then((post) => {
      contentEl.innerHTML = `
        <div class="card p-4 mb-4 shadow">
          <button class="btn btn-link mb-3" onclick="renderPostList()">← Back to List</button>
          <h1 class="fw-bold mb-2">${post.title}</h1>
          <div class="text-muted mb-2">
            <img src="./assets/icons/calendar4.svg"/> ${post.date} ${post.update ? `| 🔁 ${post.update}` : ""} • ${post.wordCount} words • ${post.readTime} min
          </div>
          <div class="mb-3">${renderTags(post.tags)}</div>
          ${post.image ? `<img src="${post.image}" class="img-fluid rounded mb-3 w-100" alt="${post.title}">` : ""}
          <hr />
          <div>${post.content}</div>
        </div>
      `;
    });
}

function renderPagination() {
  const totalPages = Math.ceil(posts.length / postsPerPage);
  paginationEl.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `btn btn-sm mx-1 ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`;
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      renderPostList();
    };
    paginationEl.appendChild(btn);
  }
}

function renderTags(tags) {
  return tags.map((tag) => `<span class="badge bg-light text-dark me-1">#${tag}</span>`).join("");
}

function renderAboutPage() {
  listEl.classList.add("d-none");
  paginationEl.classList.add("d-none");
  contentEl.classList.remove("d-none");

  contentEl.innerHTML = `
    <div class="card p-4 mb-4 shadow-sm">
      <h2 class="mb-3 fw-bold">About</h2>
      <p>This is a simple blog site inspired by <a href="https://github.com/saicaca/fuwari" target="_blank">Fuwari</a>.</p>
      <a href="https://github.com/miramsalp/salp-journey" target="_blank" class="text-decoration-none">
        <div class="text-white rounded p-3 my-3 ach tch">
          <div class="d-flex align-items-center mb-2">
            <img src="./assets/icons/github.svg" height="24" class="me-2" />
            <strong>miramsalp / salp-journey</strong>
          </div>
          <p class="mb-1">A static blog template using HTML, CSS (Bootstrap), and JS.</p>
        </div>
      </a>
      <hr class="my-4" />
      <h5 class="fw-bold">Sources of images used in this site</h5>
      <ul>
        <li><a href="https://gemini.google.com/" target="_blank">Gemini</a></li>
        <li><a href="https://www.flaticon.com/ target="_blank">Flaticon</a></li>
      </ul>
    </div>
  `;
}

function renderArchivePage() {
  listEl.classList.add("d-none");
  paginationEl.classList.add("d-none");
  contentEl.classList.remove("d-none");

  contentEl.innerHTML = `
    <div class="card p-4 mb-4 shadow-sm">
      <h2 class="mb-3 fw-bold">Archive</h2>
      <p>In progress</p>
    </div>
  `;
}

// Theme toggle logic
function updateIcon(mode) {
  icon.innerHTML = `<path d="${mode === "dark" ? sunPath : moonPath}" fill="currentColor" />`;
}

function setupTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
  document.body.classList.toggle("dark", currentTheme === "dark");
  updateIcon(currentTheme);

  toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    const theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", theme);
    updateIcon(theme);
  });
}

// On load
document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();
  setupTheme();
});
