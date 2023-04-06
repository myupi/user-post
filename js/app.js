// import { Api } from "./api.js";

const users = document.querySelector(`.users`);
const posts = document.querySelector(`.posts`);
const comments = document.querySelector(`.comments`);
const select = document.querySelector(`select`);
const title = document.querySelector("#title");
const body = document.querySelector("#body");
const form = document.querySelector(`form`);
const box = document.querySelector(".box");

async function getUsers(elem) {
  let data = await fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => console.log(error));
  data.forEach((user) => {
    let option = document.createElement("option");
    option.textContent = user.name;
    option.value = user.id;
    select.append(option);
  });
  // select.addEventListener("change", (e) => {
  //   let id = e.target.value;
  //   let post = { title: `${title.value}`, body: "bar", userId: 1 };
  //   Api.POST(id, post);
  // });
  renderUsers(data, elem);
}
getUsers(users);

async function getPosts(elem, id, user) {
  let data = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}/posts`
  )
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => console.log(error));
  renderPosts(data, elem, user);
}

async function getComments(elem, id) {
  let data = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments/`
  )
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => console.log(error));
  renderComments(data, comments);
}

function renderUsers(arr, elem) {
  elem.innerHTML = null;
  if (arr) {
    arr.forEach((item) => {
      let li = document.createElement("li");
      li.dataset.id = item.id;
      li.classList.add("list-group-item", "item-users");
      li.innerText = `${item.id}. Name: ${item.name},
            Username: ${item.username},
            Address: ${item.address.city}
        `;
      li.addEventListener("click", (e) => {
        comments.innerHTML = null;
        const itemUsers = document.querySelectorAll(`.item-users`);
        let userFind = arr.find((user) => {
          return user.id == e.target.dataset.id;
        });
        itemUsers.forEach((e) => {
          e.classList.remove("active");
        });
        li.classList.add("active");
        let id = e.target.dataset.id;
        getPosts(posts, id, userFind.name);
      });
      elem.appendChild(li);
    });
  }
}

function renderPosts(arr, elem, user) {
  elem.innerHTML = null;
  let s = 1;
  arr.forEach((item) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item", "item-posts");
    li.innerText = `Post by ${user}
    ${s}. Title: ${item.title}
            Post: ${item.body},
        `;
    li.dataset.id = item.id;
    s++;
    li.addEventListener("click", (e) => {
      const itemUsers = document.querySelectorAll(`.item-posts`);
      itemUsers.forEach((e) => {
        e.classList.remove("active");
      });
      li.classList.add("active");
      let id = e.target.dataset.id;
      getComments(comments, id);
    });
    elem.appendChild(li);
  });
}

function renderComments(arr, elem) {
  elem.innerHTML = null;
  let s = 1;
  arr.forEach((item) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerText = `${s}. Title: ${item.name}
            Comment: ${item.body},
        `;
    elem.appendChild(li);
    s++;
  });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let id = select.value;
    let post = {
      title: `${title.value}`,
      body: `${body.value}`,
      userId: id,
    };
    // console.log(post);
    Api.POST(post);
    box.innerHTML = "added " + JSON.stringify(post);
  });

const Api = {
  GET: async (value) => {
    try {
      let data = await fetch(`https://jsonplaceholder.typicode.com/${value}`)
        .then((res) => res.json())
        .then((data) => data);

      return await data;
    } catch {
      return undefined;
    }
  },
  POST: async (data) => {
    try {
      let respons = await fetch(
        `https://jsonplaceholder.typicode.com/posts`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then((res) => res.json())
        .then((json) => json);

      return respons;
    } catch {
      return alert("xatolik bo'ldi");
    }
  },
  DELETE: async (value) => {
    try {
      let respons = await fetch(
        `https://jsonplaceholder.typicode.com/${value}`,
        {
          method: "DELETE",
        }
      )
        .then((res) => res.json())
        .then((json) => json);

      return respons;
    } catch {
      return alert("xato");
    }
  },
};
