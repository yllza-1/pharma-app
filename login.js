const baseUrl = "http://localhost:5001/users";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

const loginUser = (e) => {
  e.preventDefault();

  errorMsg.textContent = "";

  fetch(baseUrl)
    .then((response) => response.json())
    .then((users) => {
      const user = users.find(
        (user) =>
          user.email === email.value && user.password === password.value,
      );

      if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } else {
        errorMsg.textContent = "Password is incorrect!";
      }
    })
    .catch((error) => {
      console.error(error);
      errorMsg.textContent = "Server error!";
    });
};

loginForm.addEventListener("submit", loginUser);
