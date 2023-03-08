const loginForm = document.querySelector("#login-form");
const inputEmailBox = document.querySelector(".login__emailbox");
const inputPasswordBox = document.querySelector(".login__passwordbox");
const inputEmail = document.querySelector("#login-email");
const inputPassword = document.querySelector("#login-password");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  inputPasswordBox.style.border = "1px solid $white";
  inputEmailBox.style.border = "1px solid $white";

  fetch("https://reqres.in/api/register", {
    method: "post",
    body: JSON.stringify({
      email: inputEmail.value,
      password: inputPassword.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw new Error(res.error);
      }

      const token = res.token;

      localStorage.setItem("token", token);

      window.location.href = "../index.html";
    });
});

const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
inputEmail.addEventListener("change", () => {
  if (!inputEmail.value.match(mailformat)) {
    inputEmailBox.style.border = "1px solid red";
  } else {
    inputEmailBox.style.border = "1px solid #fff";
  }
});
inputPassword.addEventListener("change", () => {
  if (!(inputPassword.value.trim().length >= 6)) {
    inputPasswordBox.style.border = "1px solid red";
  } else {
    inputPasswordBox.style.border = "1px solid #fff";
  }
});
