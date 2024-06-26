let userData = {};

const handleChange = (e) => {
  userData = { ...userData, [e.target.name]: e.target.value };
  console.log(userData);
};

// document.getElementById("submitButton").addEventListener("click", function () {
//   const htmlContent = document.getElementById("description").value;
//   const sanitizedContent = DOMPurify.sanitize(htmlContent);
//   // document.getElementById('output').innerHTML = sanitizedContent;
// });

const baseUrl = "http://localhost:4000/api";

const handleRegisterSubmit = (e) => {
  e.preventDefault();
  const response = fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      alert(data.message);
      window.location.href = "./login.html";
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

const handleLoginSubmit = (e) => {
  e.preventDefault();
  const response = fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      alert(data.message);
      console.log(data);
      window.location.href = "./index.html";
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

const handleCreateBlog = (e) => {
  e.preventDefault();
  const response = fetch(`${baseUrl}/create-blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      alert(data.message);
      console.log(data);
      // window.location.href = "./index.html";
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

const handleGetBlogs = () => {
  const response = fetch(`${baseUrl}/get-blogs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const blogs = data.blogs;
      console.log(blogs);
      blogs.forEach((blog) => {
        createBlogDiv(blog);
      });
    });
};

handleGetBlogs();

const createBlogDiv = (blog) => {
  const blogDiv = document.createElement("div");

  const sanitizedTitle = DOMPurify.sanitize(blog.title || "");
  const sanitizedContent = DOMPurify.sanitize(blog.content || "");
  const trimContent = sanitizedContent.substring(0, 200);
  blogDiv.classList.add("blog");
  blogDiv.innerHTML = `
     <div class="card w-full h-full bg-slate-300">
          <div class="card-body">
            <div class="card-header font-bold text-3xl text-center p-4">${sanitizedTitle}</div>
            <div class="card-content p-4">
              <p class="text-center font-normal text-muted">
                ${trimContent}
              </p>
            </div>
            <div class="card-footer p-2">
              <a href="blog.html?id=${blog._id}" class="hover:text-blue-500 cursor-pointer"><p class="pl-4">Read more ....</></a>
            </div>
            </div>
        </div>
    
  `;
  document.getElementById("blog_container").appendChild(blogDiv);
};

const handleGetBlogById = () => {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);
  const blogId = urlParams.get("id");
  const response = fetch(`${baseUrl}/get-blogs/${blogId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const blog = data.blog;
      console.log(blog);
      // createBlog(blog);
      createBlog(blog);
    })
    .catch((err) => {
      console.log(err);
    });
};


const createBlog = (blog) => {
  const sanitizedTitle = DOMPurify.sanitize(blog.title || "");
  const sanitizedContent = DOMPurify.sanitize(blog.content || "");
  const blogDiv = document.createElement("div");
  blogDiv.classList.add("blog");
  blogDiv.innerHTML = `
    <div class="card w-full h-ful">
      <div class="card-body h-full w-full">
        <div class="card-header font-bold text-3xl text-center p-4">${sanitizedTitle}</div>
        <div class="card-content h-full w-full p-4">
          <p class="text-center font-normal text-muted">
            ${sanitizedContent}
          </p>
        </div>
      </div>
    </div>
  `;
  document.getElementById("single_blog_container").appendChild(blogDiv);
}

handleGetBlogById();
