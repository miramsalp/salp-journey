let posts = [];
let currentPage = 1;
const postsPerPage = 4;

function fetchPosts() {
  fetch('posts/index.json')
    .then(res => res.json())
    .then(data => {
      posts = data;
      renderPostList();
    })
    .catch(err => console.error('Failed to load posts:', err));
}

function renderPostList() {
  const listEl = document.getElementById("post-list");
  const contentEl = document.getElementById("post-content");
  const paginationEl = document.getElementById("pagination");
  listEl.classList.remove("d-none");
  contentEl.classList.add("d-none");
  listEl.innerHTML = "";

  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const currentPosts = posts.slice(start, end);

  currentPosts.forEach(post => {
    const el = document.createElement("div");
    el.className = "card mb-4 p-4 shadow-sm";

    el.innerHTML = `
      <div class="row g-0 flex-column flex-md-row">
        <div class="col-md-8 order-2 order-md-1">
          <div class="card-body p-0 pe-md-3 pt-3 pt-md-0">
            <h4 class="fw-bold">${post.title}</h4>
            <div class="text-muted mb-2">📅 ${post.date} ${post.update ? `| 🔁 ${post.update}` : ""}</div>
            <div class="mb-2">${renderTags(post.tags)}</div>
            <p class="text-muted">${post.wordCount} words • ${post.readTime} min</p>
            <button class="btn btn-outline-primary btn-sm" onclick="renderPost('${post.id}')">Read →</button>
          </div>
        </div>
        <div class="col-md-4 order-1 order-md-2 mb-3 mb-md-0">
          <img src="${post.image}" class="img-fluid rounded w-100 h-100 object-fit-cover" style="max-height: 180px;" alt="${post.title}">
        </div>
      </div>
    `;
    listEl.appendChild(el);
  });

  renderPagination();
}

function renderPagination() {
  const paginationEl = document.getElementById("pagination");
  const totalPages = Math.ceil(posts.length / postsPerPage);
  paginationEl.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `btn btn-sm mx-1 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      renderPostList();
    };
    paginationEl.appendChild(btn);
  }
}

function renderPost(id) {
  const post = posts.find(p => p.id === id);
  const listEl = document.getElementById("post-list");
  const contentEl = document.getElementById("post-content");
  const paginationEl = document.getElementById("pagination");

  listEl.classList.add("d-none");
  paginationEl.innerHTML = "";
  contentEl.classList.remove("d-none");

  fetch(`posts/${id}.json`)
    .then(res => res.json())
    .then(post => {
      contentEl.innerHTML = `
        <div class="card p-4 shadow">
          <button class="btn btn-link mb-3" onclick="renderPostList()">← Back to List</button>
          <h1 class="fw-bold mb-2">${post.title}</h1>
          <div class="text-muted mb-2">📅 ${post.date} ${post.update ? `| 🔁 ${post.update}` : ""} • ${post.wordCount} words • ${post.readTime} min</div>
          <div class="mb-3">${renderTags(post.tags)}</div>
          <hr />
          <div>${post.content}</div>
        </div>
      `;
    });
}

function renderTags(tags) {
  return tags.map(tag => `<span class="badge bg-light text-dark me-1">#${tag}</span>`).join("");
}

document.addEventListener("DOMContentLoaded", fetchPosts);


