import renderAdmin from "./utils/renderAdmin.js";
import renderBooks from "./utils/renderBooks.js";

const bookList = document.querySelector(".cards__list");
const loader = document.querySelector(".lds-roller");
const bookTemplate = document.querySelector(".books__template");
const BASE_URL = "https://www.googleapis.com/books/v1/volumes?q=Programming";
const Admin_Api = "https://640898732f01352a8a97bdef.mockapi.io/";
const xBtnClose = document.querySelector(".modal__xclose");
const modal = document.querySelector(".modal");
const modalWrapper = document.querySelector(".modal__wrapper");
const btnLogout = document.querySelector(".header__logout");
const orderByNewest = document.querySelector(".header-filter__btn");
const newestOrRelevance = sessionStorage.getItem("newestOrRelevance");

const elAdminForm = document.querySelector("#admin-form");
const elAdminAddTitleInp = document.querySelector("#admin-addtitle");
const elAdminAddImgInp = document.querySelector("#admin-addimage");
const elAdminAddCategInp = document.querySelector("#admin-addcateg");
const elAdminAddPublisherInp = document.querySelector("#admin-addpublisher");
const elAdminAddPageInp = document.querySelector("#admin-addpage");
const elAdminAddAuthorInp = document.querySelector("#admin-addauthor");
const elAdminAddDescInp = document.querySelector("#admin-adddesc");
const elAdminAddDateInp = document.querySelector("#admin-adddate");

sessionStorage.setItem(
  "newestOrRelevance",
  BASE_URL + `&orderBy=relevance&maxResults=16`
);
if (newestOrRelevance.includes("newest")) {
  orderByNewest.innerHTML = `
            <img src="../assets/svg/calendar.svg" alt="sort by newest or oldest" />
            Order by relevance`;
} else if (newestOrRelevance.includes("relevance")) {
  orderByNewest.innerHTML = `
            <img src="../assets/svg/calendar.svg" alt="sort by newest or oldest" />
            Order by newest`;
}

let token = localStorage.getItem("token");
let allBtnPagination = 0;
let adminProducts = [];

elAdminForm.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(Admin_Api + `books/`, {
    method: "POST",
    body: JSON.stringify({
      title: elAdminAddTitleInp.value.trim(),
      image: elAdminAddImgInp.value.trim(),
      description: elAdminAddDescInp.value.trim(),
      author: elAdminAddAuthorInp.value.trim(),
      publishedDate: elAdminAddDateInp.value.trim(),
      categories: elAdminAddCategInp.value.trim(),
      pageCount: elAdminAddPageInp.value.trim(),
      publisher: elAdminAddPublisherInp.value.trim(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      window.location.href = "./admin.html";
    });
});

const getData = async () => {
  try {
    const res = await fetch(Admin_Api + "books");
    if (res.status === 404) {
      throw new Error("DATA NOT FOUND");
    }
    const data = await res.json();

    allBtnPagination = data.length;
    adminProducts = data;

    renderAdmin(adminProducts, bookList, bookTemplate);
  } catch (x) {
    console.log(x);
  }
};

getData();

loader.style.display = "none";

xBtnClose.addEventListener("click", () => {
  modal.style.cssText = "opacity: 0; pointer-events: none;";
  modalWrapper.style.cssText = "transform: translateX(400px);";
  document.body.style.overflow = "auto";
  modal.style.overflow = "auto";
});

bookList.addEventListener("click", (e) => {
  const target = e.target;
  console.log(target.dataset.id);
  if (target.className.includes("cards__infobtn")) {
    const modalItem = document.querySelector(".modal__item");
    const modalImg = document.querySelector(".modal__img");
    const modalDesc = document.querySelector(".modal__desc");
    const modalDate = document.querySelector(".modal__date");
    const modalPublishers = document.querySelector(".modal__publishers");
    const modalCategories = document.querySelector(".modal__categories");
    const modalPages = document.querySelector(".modal__pages");
    const modalTitle = document.querySelector(".modal__title");
    const modalAuthor = document.querySelector(".modal__authors");

    fetch(`${Admin_Api}books/${target.dataset.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        modalItem.textContent = null;
        modalAuthor.textContent = data.author;
        document.body.style.overflow = "hidden";
        modal.addEventListener("mousemove", () => {
          modal.style.overflow = "auto";
        });
        modalTitle.textContent = data.title;
        modal.style.cssText = "opacity: 1; pointer-events: all;";
        modalWrapper.style.cssText = "transform: translateX(0);";
        modalImg.src = data.thumbnail;
        modalDesc.innerHTML = data.description;
        modalDate.textContent = data.publishedDate;
        modalPublishers.textContent = data.publisher;
        modalPages.textContent = data.pagesCount;
        modalCategories.textContent = data.categories;
      });
  }

  if (target.className.includes("cards__bookmarkbtn")) {
    const bookmarkList = document.querySelector(".bookmark__list");

    fetch(`https://www.googleapis.com/books/v1/volumes/${target.dataset.id}`)
      .then((res) => res.json())
      .then((data) => {
        bookmarkList.innerHTML = `
            <div class="bookmark__titlebox">
                <h2 class="bookmark__title">Bookmarks</h2>
                <p class="bookmark__desc">
                        If you don’t like to read, you haven’t found the right book
                </p>
            </div>
        `;
        bookmarkList.innerHTML += `
           <div class="bookmark__item">
              <div class="bookmark__content">
                <h3 class="bookmark__listtitle">${data.volumeInfo.title}</h3>
                <p class="bookmark__author">${data.volumeInfo.authors}</p>
              </div>
              <div class="bookmark__btns">
                <button class="bookmark__openbtn">
                  <img src="../assets/svg/book-open-btn.svg" alt="bookmark open icon" />
                </button>
                <button class="bookmark__deletebtn">
                  <img src="../assets/svg/delete-btn.svg" alt="bookmark delete icon" />
                </button>
              </div>
            </div>
        `;
      });
  }
});

orderByNewest.addEventListener("click", () => {
  if (orderByNewest.textContent.includes("newest")) {
    sessionStorage.setItem(
      "newestOrRelevance",
      BASE_URL + `&orderBy=newest&maxResults=16`
    );
    orderByNewest.innerHTML = `
            <img src="../assets/svg/calendar.svg" alt="sort by newest or oldest" />
            Order by relevance`;

    getBook(BASE_URL + `&orderBy=newest&maxResults=16`);
  } else if (orderByNewest.textContent.includes("relevance")) {
    sessionStorage.setItem(
      "newestOrRelevance",
      BASE_URL + `&orderBy=relevance&maxResults=16`
    );
    orderByNewest.innerHTML = `
            <img src="../assets/svg/calendar.svg" alt="sort by newest or oldest" />
            Order by newest`;

    getBook(BASE_URL + `&orderBy=relevance&maxResults=16`);
  }
});

btnLogout.addEventListener("click", () => {
  if (token) {
    localStorage.removeItem("token");
    window.location.replace("../pages/login.html");
  }
});

window.addEventListener("click", (e) => {
  if (e.target.className == "modal") {
    modal.style.cssText = "opacity: 0; pointer-events: none;";
    modalWrapper.style.cssText = "transform: translateX(400px);";
    document.body.style.overflow = "auto";
    modal.style.overflow = "auto";
  }
});

if (!token) {
  window.location.replace("../pages/login.html");
}
