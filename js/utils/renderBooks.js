function renderBooks(array, parent, template) {
  parent.textContent = "";
  const fragment = document.createDocumentFragment();
  const showResult = document.querySelector(".header-filter__resulttext span");

  array.forEach((product) => {
    const newBook = template.content.cloneNode(true);
    const item = newBook.querySelector(".cards__item");
    const title = newBook.querySelector(".cards__title");
    const author = newBook.querySelector(".cards__author");
    const img = newBook.querySelector(".cards__img");
    const date = newBook.querySelector(".cards__date");
    const bookmarkBtn = newBook.querySelector(".cards__bookmarkbtn");
    const infoBtn = newBook.querySelector(".cards__infobtn");
    const readBtn = newBook.querySelector(".cards__readbtn");

    img.src = product.volumeInfo.imageLinks.thumbnail;
    title.textContent = product.volumeInfo.title
      .split(" ")
      .slice(0, 10)
      .join(" ");
    author.textContent = product.volumeInfo.authors;
    bookmarkBtn.dataset.id = product.id;
    infoBtn.dataset.id = product.id;
    readBtn.dataset.id = product.id;
    date.textContent = product.volumeInfo.publishedDate;

    fragment.appendChild(newBook);
  });

  showResult.textContent = array.length;
  parent.appendChild(fragment);
}

export default renderBooks;
