let userData = {};
const baseUrl = "http://localhost:4000/api";

const right_div = document.getElementById("right_div");
const createUserBlogDiv = document.getElementById("createBlogDiv");
const allBlogsDiv = document.getElementById("allBlogsDiv");
const home_div = document.getElementById("home_div");
const updateDiv = document.getElementById("updateDiv");
const update_blog = document.getElementById("update_blog");

const register_button = document.getElementById("register_button");
const login_button = document.getElementById("login_button");
const about_button = document.getElementById("about_button");
const home_button = document.getElementById("home_button");
const logout_button = document.getElementById("logout_button");
const logo_button = document.getElementById("logo_button");
// const user_button = document.getElementById("user_button");
const blog_container = document.getElementById("blog_container");
var ul_list = document.getElementById("ul_list");

const handleChange = (e) => {
  userData = { ...userData, [e.target.name]: e.target.value };
  console.log(userData);
};

function handleButtonClick(event) {
  switch (event.target.id) {
    case "register_button":
      window.location.href = "./register.html";
      break;
    case "login_button":
      window.location.href = "./login.html";
      break;
    case "home_button":
      window.location.href = "./index.html";
      break;
    case "logo_button":
      window.location.href = "./index.html";
      break;
    default:
      break;
  }
}

if (register_button)
  register_button.addEventListener("click", handleButtonClick);
if (login_button) login_button.addEventListener("click", handleButtonClick);
if (home_button) home_button.addEventListener("click", handleButtonClick);
if (logo_button) logo_button.addEventListener("click", handleButtonClick);

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
      // console.log(data);
      // console.log(token);
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

const getAllBlogs = () => {
  return fetch(`${baseUrl}/get-blogs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data.blogs)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const displayAllBlogs = () => {
  getAllBlogs().then((blogs) => {
    // console.log(blogs[0].author);
    blogs.forEach((blog) => {
      const blogDiv = document.createElement("div");

      const sanitizedTitle = DOMPurify.sanitize(blog.title || "");
      const sanitizedContent = DOMPurify.sanitize(blog.content || "");
      const trimContent = sanitizedContent.substring(0, 200);
      blogDiv.classList.add("blog");
      blogDiv.innerHTML = `
         <div class="card w-full h-full py-4 min-w-fit min-h-fit bg-slate-300">
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
      if (!blog_container) return;
      blog_container.appendChild(blogDiv);
    });
  });
};

displayAllBlogs();

const getBlogById = (id) => {
  return fetch(`${baseUrl}/get-blogs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      return data.blog;
    })
    .catch((err) => {
      console.error("Error fetching blog:", err);
      throw err; // Propagate the error further if needed
    });
};


const getUserBlogById = (id) => {
  return fetch(`${baseUrl}/get-user-blogs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      return data.blog;
    })
    .catch((err) => {
      console.error("Error fetching blog:", err);
      throw err; // Propagate the error further if needed
    });
};

const deleteBlogById = (id) => {
  return fetch(`${baseUrl}/delete/${id}`, {
    method: "DELETE",
    // headers: {
    //   "Content-Type": "application/json",
    // },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error("Error deleting blog:", err);
      throw err; // Propagate the error further if needed
    });
};

const handleUpdate = async (e,id) => {
 
  e.preventDefault();
  const token = localStorage.getItem("token");
  const response = fetch(`${baseUrl}/update/${id}`, {
    method: "PUT",
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
      console.log(data);
      closePopUp();
    })
    .catch((error) => {
      console.log("Error:", error);
    });
    
};

const displaySingleBlog = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams) return;
  // console.log(urlParams);
  const blogId = urlParams.get("id");
  if (!blogId) return;

  getBlogById(blogId).then((blog) => {
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
  });
};

displaySingleBlog();

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

const updateUserProfile = (data) => {
  const token = localStorage.getItem("token");
  return fetch(`${baseUrl}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      alert(data.message);
      console.log(data);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
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
    // console.log("No token found");
    return;
  }

  // Split the token into its parts
  const tokenParts = token.split(".");

  // Ensure the token has three parts
  if (tokenParts.length !== 3) {
    console.error("Invalid token format");
    return;
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
    return;
  }
}

const userDetailsWithEmail = () => {
  const userDetails = getUserDetails();
  if (!userDetails) return;
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
};

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

  const user_button = document.getElementById("user_button");
  user_button.addEventListener("click", handleUserProfile);

  document
    .getElementById("logout_button")
    .addEventListener("click", handleLogOut);
};

const handleLogOut = () => {
  localStorage.removeItem("token");
  window.location.href = "./index.html";
};

const handleUserProfile = () => {
  window.location.href = "../pages/userprofile.html";
};
const handleProfileLogOut = () => {
  localStorage.removeItem("token");
  window.location.href = "../pages/index.html";
};

const handleProfileCreate = () => {
  createRightDiv();
};

const userProfileName = () => {
  const userDetailsPromise = getUserDetails();

  if (!userDetailsPromise || typeof userDetailsPromise.then !== "function") {
    console.error("getUserDetails did not return a Promise.");
    return;
  }

  getUserDetails()
    .then((user) => {
      if (!user || !user.user || !user.user.full_name) return;

      const userNameElement = document.getElementById("user_name");
      if (userNameElement) {
        userNameElement.innerText = user.user.full_name;
      }
    })
    .catch((error) => {
      console.error("Error fetching user profile name:", error);
    });
};

userProfileName();

const handleUserHomeButton = () => {
  getUserDetails().then((user) => {
    if (!user || !user.user || !user.user._id) return;
    const id = user.user._id;
    // console.log(id);

    if (!home_div) return;
    home_div.innerHTML =
      '<div class="flex items-center w-full h-full bg-slate-300 justify-center"><p class="text-2xl font-normal p-4">Loading...</p></div>';
    getUserBlogById(id).then((blogs) => {
      home_div.innerHTML = "";
      if (!blogs.length) {
        home_div.innerHTML =
          '<div class="flex items-center w-full h-full bg-slate-300 justify-center"><p class="text-2xl font-normal p-4">No Blog Added</p></div>';
      }

      blogs.forEach((blog) => {
        const id = blog._id;
        // console.log("id->",id);
        const blogDiv = document.createElement("div");
        const sanitizedTitle = DOMPurify.sanitize(blog.title || "");
        const sanitizedContent = DOMPurify.sanitize(blog.content || "");
        const trimContent = sanitizedContent.substring(0, 200);
        blogDiv.classList.add("blog");
        blogDiv.innerHTML = `
           <div class="card w-full h-full min-w-fit min-h-fit py-4 bg-slate-300">
                <div class="card-body">
                  <div class="card-header font-bold text-3xl text-center p-4">${sanitizedTitle}</div>
                    <div class="card-content px-4">
                      <p class="text-center font-normal text-muted">
                        ${trimContent}.....
                      </p>
                    </div>
                  </div>
                  <div class="card-footer px-4 pt-4 flex justify-between items-center">

                    <div class="w-14 h-full rounded-full flex items-center justify-center cursor-pointer text-black hover:bg-slate-800 hover:text-white bg-white">
                        <button type="button" class="w-full h-full" onclick="handleEditBlog(event,'${id}')"><i class="fa-solid fa-pen-to-square text-2xl p-4"></i></button>
                    </div>
                    <div class="w-14 h-full rounded-full flex items-center justify-center cursor-pointer bg-red-700 text-white hover:bg-red-400 hover:text-black">
                       <button type="button" class="w-full h-full" onclick="handleDeleteBlog('${id}')"><i class="fa-solid fa-trash text-2xl p-4"></i></button>
                    </div> 
                  </div>
              </div>
          
        `;

        home_div.appendChild(blogDiv);
      });

      createUserBlogDiv.style.display = "none";
      allBlogsDiv.style.display = "none";
      home_div.style.display = "grid";
      updateDiv.style.display = "none";
    });
  });
};

handleUserHomeButton();

const handleDeleteBlog = (id) => {
  deleteBlogById(id).then((data) => {
    alert(data.message);
    console.log(data);
    handleUserHomeButton();
  });
};

let currentBlogId = null;

const handleEditBlog = async (e, id) => {
  e.preventDefault();

  currentBlogId = id;
  // console.log(currentBlogId);
  const blog = await getBlogById(id);

  console.log(blog);
  if (!blog) return;

  const div = document.createElement("div");
  div.classList.add("update_div");

  div.innerHTML = `
  <div
    class="shadow-md rounded-md md:w-[600px] w-[300px] mx-auto bg-clip-padding backdrop-filter bg-slate-300 bg-opacity-30 backdrop-blur-sm">

    <div class="relative">
      <h1 class="text-4xl text-center font-bold text-gray-900 py-3">
        Update Blog
      </h1>

      <div class="absolute w-10 h-10 flex items-center justify-center rounded-full top-2 inset-x-[34rem]">
        <button type="button" class="w-full h-full bg-blue-500 rounded-full hover:bg-red-500 hover:text-white" onclick="closePopUp()"><i class="fa-solid fa-xmark font-semibold"></i></button>
      </div>
    
    </div>

    <form class="w-full min-h-fit p-4">
      <div class="flex flex-col p-2 w-full">
        <label for="title" class="text-xl font-semibold text-gray-900 block">Tittle :</label>
        <input type="text" class="w-full p-2 border-2 rounded-md border-sky-300 outline-2 outline-slate-500"
        id="title" placeholder="enter tittle" name="title"
        value="${blog.title}"
        onchange="handleChange(event)" />
      </div>

      <div class="flex flex-col p-2 w-full">
        <label for="description" class="text-xl font-semibold text-gray-900 block">Description :</label>
        <textarea class="w-full p-2 border-2 rounded-md border-sky-300 outline-2 outline-slate-500" id="description"
        rows="10" cols="10" placeholder="enter description" name="description"
        onchange="handleChange(event)">
        ${blog.content}
        </textarea>
      </div>
      <div class="p-2 w-full">
        <button class="button" type="button" onclick="handleUpdate(event,'${currentBlogId}')">
          Update
        </button>
      </div>
    </form>
 
  </div>`;



  home_div.classList.add("opacity-40");
  update_blog.style.display = "flex";
  update_blog.appendChild(div);
};

const closePopUp = () => {
  update_blog.style.display = "none";
  home_div.classList.remove("opacity-40");

  userData = {};
  // console.log(userData);
  currentBlogId = null;
};



const handleUserCreateDisplay = () => {
  const div = document.createElement("div");

  div.classList.add("create_div");

  div.innerHTML = ` <div
        class="shadow-md rounded-md md:w-[600px] w-[300px] mx-auto bg-clip-padding backdrop-filter bg-slate-300 bg-opacity-30 backdrop-blur-sm">
        <h1 class="text-4xl text-center font-bold text-gray-900 py-3">
          Create a new blog
        </h1>

        <form action="" class="w-full min-h-fit p-4">
          <div class="flex flex-col p-2 w-full">
            <label for="tittle" class="text-xl font-semibold text-gray-900 block">Tittle :</label>
            <input type="text" class="w-full p-2 border-2 rounded-md border-sky-300 outline-2 outline-slate-500"
              id="title" placeholder="enter tittle" name="title" onchange="handleChange(event)" />
          </div>

          <div class="flex flex-col p-2 w-full">
            <label for="description" class="text-xl font-semibold text-gray-900 block">Description :</label>
            <textarea class="w-full p-2 border-2 rounded-md border-sky-300 outline-2 outline-slate-500" id="description"
              rows="10" cols="10" placeholder="enter description" name="description"
              onchange="handleChange(event)"></textarea>
          </div>
          <div class="p-2 w-full">
            <button class="button" id="submitButton" onclick="handleCreateBlog(event)">
              Create
            </button>
          </div>
        </form>
    
      </div>`;
  createUserBlogDiv.appendChild(div);
  allBlogsDiv.style.display = "none";
  home_div.style.display = "none";
  updateDiv.style.display = "none";
  createUserBlogDiv.style.display = "block";
};

const handleAllBlogsDisplay = () => {
  getUserDetails().then((user) => {
    if (!user || !user.user || !user.user._id) return;
    const id = user.user._id;
    // console.log(id);

    allBlogsDiv.innerHTML =
      '<div class="flex items-center w-full h-full bg-slate-300 justify-center"><p class="text-2xl font-normal p-4">Loading...</p></div>';
    getUserBlogById(id).then((blogs) => {
      allBlogsDiv.innerHTML = "";
      if (!blogs.length) {
        allBlogsDiv.innerHTML =
          '<div class="flex items-center w-full h-full bg-slate-300 justify-center"><p class="text-2xl font-normal p-4">No Blog Added</p></div>';
      }

      blogs.forEach((item) => {
        const sanitizedTitle = DOMPurify.sanitize(item.title || "");
        const sanitizedContent = DOMPurify.sanitize(item.content || "");
        const div = document.createElement("div");
        div.classList.add("create_div");

        div.innerHTML = `
               <div class="flex w-full h-fit container">
                  <div class="card w-full h-full  py-4 min-w-fit min-h-fit bg-slate-300">
                      <div class="card-body">
                          <div class="card-header font-bold text-3xl text-center p-4">${sanitizedTitle}</div>
                            <div class="card-content p-4">
                                <p class="text-center font-normal text-muted">
                                    ${sanitizedContent}
                                </p>
                            </div>
                      </div>
                  </div>
              </div>
              
              `;

        allBlogsDiv.appendChild(div);
      });

      createUserBlogDiv.style.display = "none";
      allBlogsDiv.style.display = "block";
      home_div.style.display = "none";
      updateDiv.style.display = "none";
    });
  });
};

const handleUpdateDisplay = (e) => {
  e.preventDefault();
  updateDiv.innerHTML = "";
  const div = document.createElement("div");

  div.classList.add("create_div");

  div.innerHTML = ` <div
        class="shadow-md rounded-md md:w-[600px] w-[300px] mx-auto bg-clip-padding backdrop-filter bg-slate-300 bg-opacity-30 backdrop-blur-sm">
        <h1 class="text-4xl text-center font-bold text-gray-900 py-3">
          Update Profile
        </h1>

        <form action="" class="w-full min-h-fit p-4">

          <div class="flex flex-col p-2 w-full">
            <label for="name" class="text-xl font-semibold text-gray-900 block">Name :</label>
            <input type="text" class="w-full p-2 border-2 rounded-md border-sky-300 outline-2 outline-slate-500"
              id="name" placeholder="enter your name" name="name" onchange="handleChange(event)" />
          </div>

          <div class="flex flex-col p-2 w-full">
            <label for="email" class="text-xl font-semibold text-gray-900 block">Email :</label>
            <input type="text" class="w-full p-2 border-2 rounded-md border-sky-300 outline-2 outline-slate-500"
              id="email" placeholder="enter your email" name="email" onchange="handleChange(event)" />
          </div>

          <div class="flex flex-col p-2 w-full">
            <label for="password" class="text-xl font-semibold text-gray-900 block">Password :</label>
            <input type="password" class="w-full p-2 border-2 rounded-md border-sky-300 outline-2 outline-slate-500"
            id="password" placeholder="enter your password" name="password" onchange="handleChange(event)" />
          </div>
          <div class="p-2 w-full">
            <button class="button" type="button" id="submitButton" onclick="handleUpdateProfile(event)">
              Update
            </button>
          </div>
        </form> 
      </div>`;
  updateDiv.appendChild(div);
  allBlogsDiv.style.display = "none";
  home_div.style.display = "none";
  createUserBlogDiv.style.display = "none";
  updateDiv.style.display = "block";
};

const handleUpdateProfile = (e) => {
  e.preventDefault();
  updateUserProfile(userData);
  window.location.href = "./userprofile.html";
};
