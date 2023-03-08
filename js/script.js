import renderBooks from "./utils/renderBooks.js";

const bookList = document.querySelector(".cards__list");
const loader = document.querySelector(".lds-roller");
const bookTemplate = document.querySelector(".books__template");
const BASE_URL = "https://www.googleapis.com/books/v1/volumes?q=Programming";
const cardPagination = document.querySelector(".cards__pagination");
const xBtnClose = document.querySelector(".modal__xclose");
const modal = document.querySelector(".modal");
const modalWrapper = document.querySelector(".modal__wrapper");
const btnLogout = document.querySelector(".header__logout");
const orderByNewest = document.querySelector(".header-filter__btn");
const newestOrRelevance = sessionStorage.getItem("newestOrRelevance");

sessionStorage.setItem(
  "newestOrRelevance",
  BASE_URL + `&orderBy=relevance&maxResults=8`
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
let books = [];
let allBtnPagination = 0;
let activePage = 1;
let PageSize = 8;

const getBook = async (url) => {
  try {
    loader.style.display = "block";

    const res = await fetch(url);

    if (res.status === 404) {
      throw new Error("XATO!!!");
    }
    const data = await res.json();

    allBtnPagination = data.items.length;

    const fragmentBtn = document.createDocumentFragment();

    cardPagination.innerHTML = `
         <button id="prev" style='${
           activePage == 1
             ? "pointer-events: none; opacity: 0.5; background: #919eab"
             : " "
         }'>
           <img src="./assets/svg/pagination-left.svg" alt="arrow-prev icon">
         </button>
        `;

    for (let i = 0; i < 40 / PageSize; i++) {
      const newBtn = document.createElement("button");

      newBtn.className = "cards__pagebtn";
      newBtn.dataset.id = i + 1;
      newBtn.textContent = i + 1;

      if (activePage == i + 1) {
        newBtn.style.color = "#0d75ff";
        newBtn.style.border = "1px solid #0d75ff";
      }

      fragmentBtn.appendChild(newBtn);
    }
    cardPagination.appendChild(fragmentBtn);

    cardPagination.innerHTML += `
    <button id="next" style='${
      activePage == 5
        ? "pointer-events: none; opacity: 0.5; background: #919eab"
        : " "
    }'>
    <img src="./assets/svg/pagination-right.svg" alt="arrow-right icon">
    </button>
    `;

    books = data.items;
    renderBooks(books, bookList, bookTemplate);
  } finally {
    loader.style.display = "none";
  }
};

cardPagination.addEventListener("click", (e) => {
  const target = e.target;

  if (target.className.includes("cards__pagebtn")) {
    const page = e.target.dataset.id;
    activePage = page;

    if (newestOrRelevance) {
      getBook(
        sessionStorage.getItem("newestOrRelevance") +
          `&startIndex=${PageSize * (activePage - 1)}`
      );
    }
  }

  if (e.target.id === "prev") {
    if (activePage != 1) {
      activePage--;
      if (newestOrRelevance) {
        getBook(
          sessionStorage.getItem("newestOrRelevance") +
            `&startIndex=${PageSize * (activePage - 1)}`
        );
      }
    }
  }

  if (e.target.id === "next") {
    if (activePage != 5) {
      activePage++;

      if (newestOrRelevance) {
        getBook(
          sessionStorage.getItem("newestOrRelevance") +
            `&startIndex=${PageSize * (activePage - 1)}`
        );
      }
    }
  }
  const fragmentBtn = document.createDocumentFragment();

  cardPagination.innerHTML = `
         <button id="prev" style='${
           activePage == 1
             ? "pointer-events: none; opacity: 0.5; background: #919eab"
             : " "
         }'>
           <img src="./assets/svg/pagination-left.svg" alt="arrow-prev icon">
         </button>
        `;

  for (let i = 0; i < 40 / PageSize; i++) {
    const newBtn = document.createElement("button");

    newBtn.className = "cards__pagebtn";
    newBtn.dataset.id = i + 1;
    newBtn.textContent = i + 1;

    if (activePage == i + 1) {
      newBtn.style.color = "#0d75ff";
      newBtn.style.border = "1px solid #0d75ff";
    }

    fragmentBtn.appendChild(newBtn);
  }
  cardPagination.appendChild(fragmentBtn);

  cardPagination.innerHTML += `
    <button id="next" style='${
      activePage == 5
        ? "pointer-events: none; opacity: 0.5; background: #919eab"
        : " "
    }'>
    <img src="./assets/svg/pagination-right.svg" alt="arrow-right icon">
    </button>
    `;
});
xBtnClose.addEventListener("click", () => {
  modal.style.cssText = "opacity: 0; pointer-events: none;";
  modalWrapper.style.cssText = "transform: translateX(400px);";
  document.body.style.overflow = "auto";
  modal.style.overflow = "auto";
});

bookList.addEventListener("click", (e) => {
  const target = e.target;

  if (target.className.includes("cards__infobtn")) {
    const modalItem = document.querySelector(".modal__item");
    const modalImg = document.querySelector(".modal__img");
    const modalDesc = document.querySelector(".modal__desc");
    const modalDate = document.querySelector(".modal__date");
    const modalPublishers = document.querySelector(".modal__publishers");
    const modalCategories = document.querySelector(".modal__categories");
    const modalPages = document.querySelector(".modal__pages");
    const modalTitle = document.querySelector(".modal__title");

    fetch(`https://www.googleapis.com/books/v1/volumes/${target.dataset.id}`)
      .then((res) => res.json())
      .then((data) => {
        let categories;
        const fragmentDiv = document.createDocumentFragment();
        modalItem.textContent = null;

        modalItem.innerHTML = `<p class="modal__authortext modal__itemtext">Author: </p>`;

        data.volumeInfo.authors.forEach((author) => {
          const newDiv = document.createElement("div");
          console.log(author);

          newDiv.className = "modal__authors modal__itembox";
          newDiv.textContent = author;
          fragmentDiv.appendChild(newDiv);
        });

        modalItem.appendChild(fragmentDiv);

        let apiCategories =
          data.volumeInfo.categories == undefined
            ? "Not Category"
            : data.volumeInfo.categories.join(" / ").split(" / ");

        const categoriesSet = new Set(apiCategories);

        categories = Array.from(categoriesSet);

        document.body.style.overflow = "hidden";
        modal.addEventListener("mousemove", () => {
          modal.style.overflow = "auto";
        });
        modalTitle.textContent = data.volumeInfo.title;
        modal.style.cssText = "opacity: 1; pointer-events: all;";
        modalWrapper.style.cssText = "transform: translateX(0);";
        modalImg.src = data.volumeInfo.imageLinks.thumbnail;
        modalDesc.innerHTML = data.volumeInfo.description;
        modalDate.textContent = data.volumeInfo.publishedDate;
        modalPublishers.textContent = data.volumeInfo.publisher;
        modalPages.textContent = data.volumeInfo.pageCount;
        if (apiCategories == "Not Category") {
          modalCategories.textContent = apiCategories;
          modalCategories.style.color = "#ff00fa";
        } else {
          modalCategories.textContent = categories.join(" / ");
          modalCategories.style.color = "#0d75ff";
        }
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
                  <img src="./assets/svg/book-open-btn.svg" alt="bookmark open icon" />
                </button>
                <button class="bookmark__deletebtn">
                  <img src="./assets/svg/delete-btn.svg" alt="bookmark delete icon" />
                </button>
              </div>
            </div>
        `;
      });
  }
});

getBook(
  sessionStorage.getItem("newestOrRelevance") +
    `&startIndex=${PageSize * (activePage - 1)}`
);

orderByNewest.addEventListener("click", () => {
  if (orderByNewest.textContent.includes("newest")) {
    sessionStorage.setItem(
      "newestOrRelevance",
      BASE_URL + `&orderBy=newest&maxResults=8`
    );
    orderByNewest.innerHTML = `
            <img src="./assets/svg/calendar.svg" alt="sort by newest or oldest" />
            Order by relevance`;

    getBook(BASE_URL + `&orderBy=newest&maxResults=8`);
  } else if (orderByNewest.textContent.includes("relevance")) {
    sessionStorage.setItem(
      "newestOrRelevance",
      BASE_URL + `&orderBy=relevance&maxResults=8`
    );
    orderByNewest.innerHTML = `
            <img src="./assets/svg/calendar.svg" alt="sort by newest or oldest" />
            Order by newest`;

    getBook(BASE_URL + `&orderBy=relevance&maxResults=8`);
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
