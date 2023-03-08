function renderAdmin(array, parent, template) {
  parent.textContent = null;
  const fragment = document.createDocumentFragment();

  array.forEach((product) => {
    const newBook = template.content.cloneNode(true);
    const title = newBook.querySelector(".cards__title");
    const author = newBook.querySelector(".cards__author");
    const img = newBook.querySelector(".cards__img");
    const date = newBook.querySelector(".cards__date");
    const bookmarkBtn = newBook.querySelector(".cards__bookmarkbtn");
    const infoBtn = newBook.querySelector(".cards__infobtn");
    const readBtn = newBook.querySelector(".cards__readbtn");

    img.src = product.thumbnail;
    title.textContent = product.title.split(" ").slice(0, 10).join(" ");
    author.textContent = product.author;
    bookmarkBtn.dataset.id = product.id;
    infoBtn.dataset.id = product.id;
    readBtn.dataset.id = product.id;
    date.textContent = product.publishedDate;

    fragment.appendChild(newBook);
  });
  parent.appendChild(fragment);
}

export default renderAdmin;
