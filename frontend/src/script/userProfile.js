



export const handleUserProfile = () => {
  window.location.href = "../pages/userprofile.html";
};
export const handleProfileLogOut = () => {
  localStorage.removeItem("token");
  window.location.href = "../pages/index.html";
};
 export const handleProfileHome = () => {
  window.location.href = "../pages/index.html";
};
export const handleProfileCreate = () => {
  createRightDiv();

  // window.location.href='../pages/create.html';
};

export const handleAllBlogs = (blog) => {
  if (right_div.children[0]) {
    right_div.removeChild(right_div.children[0]);
  }
  const sanitizedTitle = DOMPurify.sanitize(blog.title || "");
  const sanitizedContent = DOMPurify.sanitize(blog.content || "");
  const trimContent = sanitizedContent.substring(0, 200);
  const div = document.createElement("div");
  div.classList.add("create_div");

  div.innerHTML = `
         <div class="bg-red-400 flex flex-col w-full h-fit container">
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
        </div>
        
        `;

  allBlogsDiv.appendChild(div);
};


export const createRightDiv = () => {
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
        <!-- <div class="pb-4">
            <p class="text-center text-gray-900">
              Don't have an account? <a href="./register.html">Register</a>
            </p>
          </div> -->
      </div>`;
    createBlogDiv.appendChild(div);
};
