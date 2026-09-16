const nav = document.getElementById("nav");
const footer = document.getElementById("footer");
const login = document.getElementById("login");

if (nav) {
  fetch("../components/nav.html")
    .then((res) => res.text())
    .then((data) => (nav.innerHTML = data));
}

if (footer) {
  fetch("../components/footer.html")
    .then((res) => res.text())
    .then((data) => (footer.innerHTML = data));
}

// USERS LIST FETCH
const usersList = document.getElementById("usersList");

if (usersList) {
  fetch("http://localhost:3000/users")
    .then((res) => res.json())
    .then((users) => {

      users.forEach((user) => {
        usersList.innerHTML += `
          <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
          </tr>`;
      });
    });
}

// REGISTER MODAL

function openModal() {
  document.getElementById("contactModal").style.display = "flex";
}
function closeModal() {
  document.getElementById("contactModal").style.display = "none";
}

async function submitForm(e) {
  if (e) e.preventDefault();
  let usernameInput = document.querySelector(".usernameInput");
  let email = document.querySelector(".email");
  let password = document.querySelector(".password");

  if (
    email.value.trim() === "" ||
    password.value.trim() === "" ||
    usernameInput.value.trim() === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const userData = {
    username: usernameInput.value,
    email: email.value,
    password: password.value,
  };

const res = await fetch("http://localhost:3000/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(userData) 
});

const result = await res.json(); 

if (res.ok) {
  alert(result.message); // ok
  closeModal();
} else {
  alert(result.error); // uzhe tirkeldi
}
}

// LOGIN FUNCTION
function logIn() {
  document.getElementById("login").style.display = "flex";
}
function closeLoginModal() {
  document.getElementById("login").style.display = "none";
}

async function logInBas() {
  // let loginName = document.querySelector(".loginName");
  let loginEmail = document.querySelector(".loginEmail");
  let loginPassword = document.querySelector(".loginPassword");

  const loginData = {
    email: loginEmail.value,
    password: loginPassword.value
  };

  // Tekseris logindegi
  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData)
  });

  const data = await res.json();

  // res.statusCode = 200 (res.ok) successssss:
  if (res.ok) {
    alert("Welcome back!");
    closeLoginModal();
  } else {
    // res.statusCode = 401 errooorrr:
    alert(data.message || "Wrong credentials. Please try again.");
  }
}
