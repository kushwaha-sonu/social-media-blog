let userData = {};
const baseUrl = "http://localhost:4000/api";

const register_button = document.getElementById("register_button");
const login_button = document.getElementById("login_button");
const create_button = document.getElementById("create_button");
const home_button = document.getElementById("home_button");
const logout_button = document.getElementById("logout_button");
const user_button = document.getElementById("user_button");
const blog_container= document.getElementById("blog_container");
var ul_list = document.getElementById("ul_list");

const handleChange = (e) => {
  userData = { ...userData, [e.target.name]: e.target.value };
  console.log(userData);
};

register_button.addEventListener("click", () => {
  window.location.href = "./register.html";
});

login_button.addEventListener("click", () => {
  window.location.href = "./login.html";
});

create_button.addEventListener("click", () => {
  window.location.href = "./create.html";
});

home_button.addEventListener("click", () => {
  window.location.href = "./index.html";
});
document.getElementById("logo_button").addEventListener("click", () => {
  window.location.href = "./index.html";
});

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
      const token = data.token;
      localStorage.setItem("token", token);
      console.log(data);
      console.log(token);
      window.location.href = "./index.html";
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

const handleCreateBlog = (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const response = fetch(`${baseUrl}/create-blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      alert(data.message);
      // console.log(data);
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
      // console.log(blogs);
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
     <div class="card w-full h-full  py-4 min-w-fit min-h-fit bg-slate-300">
          <div class="card-body">
            <div class="card-header font-bold text-3xl text-center p-4">${sanitizedTitle}</div>
            <div class="card-content p-4">
              <p class="text-center font-normal text-muted">
                ${trimContent}.....
              </p>
            </div>
            <div class="card-footer p-2">
              <a href="blog.html?id=${blog._id}" class="hover:text-blue-500 cursor-pointer"><p class="pl-4 font-semibold">Read more ....</></a>
            </div>
            </div>
        </div>
    
  `;
  if(!blog_container)return;
  blog_container.appendChild(blogDiv);
};

const handleGetBlogById = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if(!urlParams)return;
  // console.log(urlParams);
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
      // console.log(blog);
      createBlog(blog);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createBlog = (blog) => {
  if (!blog) return;
  const sanitizedTitle = DOMPurify.sanitize(blog.title || "");
  const sanitizedContent = DOMPurify.sanitize(blog.content || "");
  const blogDiv = document.createElement("div");
  blogDiv.classList.add("blog");
  blogDiv.innerHTML = `
    <div class="card w-full h-full">
      <div class="card-body h-full w-full">
        <div class="card-header font-bold text-3xl text-center">${sanitizedTitle}</div>
        <div class="card-content h-full w-full p-4">
          <div class="card_content">
           ${sanitizedContent}
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById("single_blog_container").appendChild(blogDiv);
};

handleGetBlogById();

const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`${baseUrl}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

// Function to decode the base64 URL encoded string
function base64UrlDecode(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// Function to get user details from the JWT
function getUserDetails() {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  // Check if the token exists
  if (!token) {
    console.log("No token found");
    return null;
  }

  // Split the token into its parts
  const tokenParts = token.split(".");

  // Ensure the token has three parts
  if (tokenParts.length !== 3) {
    console.error("Invalid token format");
    return null;
  }

  // Decode the payload (second part of the token)
  try {
    const decodedPayload = base64UrlDecode(tokenParts[1]);
    // console.log("User Details:", decodedPayload.email);
    if (!decodedPayload.email) {
      return;
    }
    const user = getUserByEmail(decodedPayload.email);
    return user; // Return the user details
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

const userDetailsWithEmail=()=>{

  const userDetails = getUserDetails();
  if(!userDetails)return;
  userDetails.then((user) => {
    const user_name = user.user.full_name;
    // console.log(user_name);
    if (!user_name) {
      login_button.innerText = "Login";
      register_button.innerText = "Register";
      return;
    }
    handleButtonDisplay(user_name);
  });
}

userDetailsWithEmail();

const handleButtonDisplay = (user) => {
  let list_item1;
  let list_item2;
  if (!ul_list) return;
  if (user) {
    // console.log(user);

    list_item1 = document.createElement("li");
    list_item2 = document.createElement("li");

    // Remove the third and fourth children only if they exist
    if (ul_list.children[2]) {
      ul_list.removeChild(ul_list.children[2]);
    }
    if (ul_list.children[2]) {
      // Note: This is still index 2 because the previous 2nd item was removed
      ul_list.removeChild(ul_list.children[2]);
    }

    list_item1.innerHTML = `
    <button class="px-4 w-full h-full py-2 text-2xl rounded-md bg-blue-600 font-semibold" id="user_button">${user}</button>
    `;
    list_item2.innerHTML = `
    <button class="px-4 w-full h-full py-2 text-2xl rounded-md bg-blue-600 font-semibold" id="logout_button">Log Out</button>
    `;
  }

  // Ensure list_item1 is defined before appending
  ul_list.appendChild(list_item1);
  ul_list.appendChild(list_item2);

  document
    .getElementById("logout_button")
    .addEventListener("click", handleLogOut);
};

const handleLogOut = () => {
  localStorage.removeItem("token");
  window.location.href = "./index.html";
};
