const baseUrl = "http://localhost:5001/users";

const registerForm = document.getElementById("registerForm");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const errorName = document.getElementById("errorName");
const errorEmail = document.getElementById("errorEmail");
const errorPassword = document.getElementById("errorPassword");
const errorConfirmPassword = document.getElementById("errorConfirmPassword");

const validateName = () => {
  const nameValue = name.value.trim();

  if (nameValue === "") {
    errorName.textContent = "Name is required";
    return false;
  }

  if (nameValue.length < 2) {
    errorName.textContent = "Name is too short";
    return false;
  }

  errorName.textContent = "";
  return true;
};

const validateEmail = () => {
  const emailValue = email.value.trim();

  if (emailValue === "") {
    errorEmail.textContent = "Email is required";
    return false;
  }

  if (!emailValue.includes("@") || !emailValue.includes(".")) {
    errorEmail.textContent = "Email must include @ and .";
    return false;
  }

  errorEmail.textContent = "";
  return true;
};

const validatePassword = () => {
  const passwordValue = password.value.trim();

  if (passwordValue === "") {
    errorPassword.textContent = "Password is required";
    return false;
  }

  if (passwordValue.length < 6) {
    errorPassword.textContent = "Password must be at least 6 characters";
    return false;
  }

  errorPassword.textContent = "";
  return true;
};

const validateConfirmPassword = () => {
  const confirmPasswordValue = confirmPassword.value.trim();

  if (confirmPasswordValue === "") {
    errorConfirmPassword.textContent = "Confirm Password is required";
    return false;
  }

  if (password.value !== confirmPasswordValue) {
    errorConfirmPassword.textContent = "Passwords do not match";
    return false;
  }

  errorConfirmPassword.textContent = "";
  return true;
};

name.addEventListener("blur", validateName);
email.addEventListener("blur", validateEmail);
password.addEventListener("blur", validatePassword);
confirmPassword.addEventListener("blur", validateConfirmPassword);

errorName.style.color = "red";
errorEmail.style.color = "red";
errorPassword.style.color = "red";
errorConfirmPassword.style.color = "red";

const registerUser = (e) => {
  e.preventDefault();

  if (
    validateName() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirmPassword()
  ) {
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };

    fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then(() => {
        window.location.href = "log-in.html";
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

registerForm.addEventListener("submit", registerUser);
