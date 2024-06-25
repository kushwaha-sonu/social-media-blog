let userData = {};

const handleChange = (e) => {
  userData = { ...userData, [e.target.name]: e.target.value };
  console.log(userData);
};

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
