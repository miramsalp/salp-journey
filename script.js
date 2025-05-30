let posts = [];

function fetchPosts() {
  fetch('./posts/index.json')
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
  listEl.classList.remove("d-none");
  contentEl.classList.add("d-none");
  listEl.innerHTML = "";

  posts.forEach(post => {
    const el = document.createElement("div");
    el.className = "card mb-4 p-4 shadow-sm";

    el.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>
          <h4>${post.title}</h4>
          <div class="text-muted mb-2">
            📅 ${post.date} ${post.update ? `| 🔁 ${post.update}` : ""}
          </div>
          <div class="mb-2">
            ${renderTags(post.tags)}
          </div>
          <p class="text-muted">${post.wordCount} words • ${post.readTime} min</p>
          <button class="btn btn-outline-primary btn-sm" onclick="renderPost('${post.id}')">Read →</button>
        </div>
        <img src="${post.image}" class="rounded" style="max-height:150px;">
      </div>
    `;

    listEl.appendChild(el);
  });
}

function renderPost(id) {
  const listEl = document.getElementById("post-list");
  const contentEl = document.getElementById("post-content");
  listEl.classList.add("d-none");
  contentEl.classList.remove("d-none");

  fetch(`posts/${id}.json`)
    .then(res => res.json())
    .then(post => {
      contentEl.innerHTML = `
        <div class="card p-4 shadow">
          <button class="btn btn-link mb-3" onclick="renderPostList()">← Back to List</button>
          <h1 class="fw-bold mb-2">${post.title}</h1>
          <div class="text-muted mb-2">
            📅 ${post.date} ${post.update ? `| 🔁 ${post.update}` : ""} • ${post.wordCount} words • ${post.readTime} min
          </div>
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
