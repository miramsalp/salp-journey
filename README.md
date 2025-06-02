# Salp Journey Blog

A personal blog built using HTML, CSS (Bootstrap), and vanilla JavaScript.  
Inspired by the layout and aesthetic of [fuwari](https://github.com/saicaca/fuwari).

## Features

- Minimal, responsive layout using Bootstrap
- Light/Dark theme toggle (with localStorage)
- Blog posts are written in `.json` files and rendered dynamically
- Supports tags, pagination, and reading time

## Folder Structure

```
├── index.html
├── script.js
├── style.css
├── assets/
│   ├── images/
│   └── icons/
├── posts/
│   ├── index.json
│   └── your-post.json
```

## How to Add a New Post

1. **Create a post JSON file** under `posts/`, like `my-post.json`  
   Example:

   ```json
   {
     "id": "my-post",
     "title": "My First Blog Post",
     "date": "2025-06-01",
     "tags": ["Life"],
     "wordCount": 120,
     "readTime": 1,
     "image": "./assets/images/example.png",
     "content": "<h2>Hello World</h2><p>This is my first post!</p>"
   }
   ```

2. **Add a reference** to your post in `posts/index.json`:

   ```json
   {
     "id": "my-post",
     "title": "My First Blog Post",
     "date": "2025-06-01",
     "tags": ["Life"],
     "wordCount": 120,
     "readTime": 1,
     "image": "./assets/images/example.png"
   }
   ```

3. **Refresh the browser** — your post will appear in the blog automatically.
