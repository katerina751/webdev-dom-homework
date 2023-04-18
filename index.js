import { addComment, getComments } from "./api.js";
import { renderLoginComponent } from "./login-component.js";

const deleteButtonElement = document.getElementById("delete-button");
const listElement = document.getElementById("list");

// const loaderStartElement = document.getElementById("loader-start");
// const loaderPostElement = document.getElementById("loader-post");

let comments = [];


let token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";

token = null;


const options = {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
  timezone: "UTC",
  hour: "numeric",
  minute: "2-digit",
};

// Получаем данные из хранилища

const fetchAndRenderComments = () => {
  // fetch - запускает запрос в api
  return getComments({ token })
    .then((responseData) => {
      comments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date).toLocaleString("ru-RU", options),
          text: comment.text,
          counter: comment.likes,
          liked: false,
        };
      });
      // получили данные и рендерим их в приложении
      renderApp();
    })
    .then(() => {
      // loaderStartElement.style.display = "none";
    })
    .catch((error) => {
      alert("Кажется, что-то пошло не так, попробуйте позже");
      // TODO: Отправлять в систему сбора ошибок
      console.warn(error);
    });
};

// loaderPostElement.style.display = "none";


// Оживляем кнопку лайков

const changeLikesListener = () => {
  const buttonLikeElements = document.querySelectorAll(".like-button");

  for (const buttonLikeElement of buttonLikeElements) {
    buttonLikeElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = buttonLikeElement.dataset.index;

      if (comments[index].liked === false) {
        comments[index].liked = true;
        comments[index].counter += 1;
      } else if (comments[index].liked === true) {
        comments[index].liked = false;
        comments[index].counter -= 1;
      }
      renderApp();
    });
  }
};


// ответ на комментарии

const editComment = () => {
  const comments = document.querySelectorAll(".comment");
  const textInputElement = document.getElementById("text-input");
  for (const comment of comments) {
    comment.addEventListener("click", () => {
      const textComment = comment.dataset.text;
      textInputElement.value = textComment;
    });
  }
};


//рендер-функция

const renderApp = () => {
  const appEl = document.getElementById("app");

  if (!token) {

    renderLoginComponent({
      appEl,
      setToken: (newToken) => {
        token = newToken;
      },
      fetchAndRenderComments,
    });

    return;
  }

  const commentsHtml = comments
    .map((comment, index) => {
      return `
      <li data-text = '&gt ${comment.text} \n ${comment.name
        }' class="comment">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${comment.text}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.counter}</span>
            <button data-index = '${index}' class="${comment.liked ? "like-button -active-like" : "like-button"
        }"></button>
          </div>
        </div>
      </li>`;
    })
    .join("");

  const appHtml = `
    <div class="container">
    <p id="loader-start">Пожалуйста, подождите, загружаю комментарии...</p>
    <ul id="list" class="comments">
      <!-- Список рендерится из JS -->
      ${commentsHtml}
    </ul>
    <div>
    <!-- <p id="loader-post">Комментарий добавляется...</p>-->
    </div>
    <div class="add-form">
      <input type="text" id="name-input" class="add-form-name" placeholder="Введите ваше имя" />
      <textarea type="textarea" id="text-input" class="add-form-text" placeholder="Введите ваш комментарий"
        rows="4"></textarea>
      <div class="add-form-row">
        <button id="add-button" class="add-form-button">Написать</button>
      </div>
    </div>
  </div>`;

  appEl.innerHTML = appHtml;

  const buttonElement = document.getElementById("add-button");
  const nameInputElement = document.getElementById("name-input");
  const textInputElement = document.getElementById("text-input");
  const mainForm = document.querySelector(".add-form");

  //Добавление комментария

  buttonElement.addEventListener("click", () => {
    nameInputElement.classList.remove("error");
    textInputElement.classList.remove("error");

    if (nameInputElement.value === "" || textInputElement.value === "") {
      nameInputElement.classList.add("error");
      textInputElement.classList.add("error");
      return;
    }

    const date = new Date().toLocaleString("ru-RU", options);

    // name и text: textInputElement.value
    // .replaceAll("<", "&lt;")
    // .replaceAll(">", "&gt;"),

    addComment({
      name: nameInputElement.value,
      date: new Date(),
      text: textInputElement.value,
      forceError: true,
      token,
    })
      .then(() => {
        return fetchAndRenderComments();
      })
      .then(() => {
        // loaderPostElement.style.display = "none";
        mainForm.style.display = "flex";

      })
      .catch((error) => {
        buttonElement.disabled = false;
        alert("Кажется, у вас сломался интернет, попробуйте позже");
        // TODO: Отправлять в систему сбора ошибок
        console.warn(error);
      });

    renderApp();
  });

  // ввод по кнопке enter

  mainForm.addEventListener('keydown', (e) => {
    if (!e.shiftKey && e.key === 'Enter') {
      buttonElement.click();
      nameInputElement.value = '';
      textInputElement.value = '';
    }
  });

  // блокировка кнопки
  const validateInput = () => {
    if (nameInputElement.value === "" || textInputElement.value === "") {
      buttonElement.disabled = true;
    } else {
      buttonElement.disabled = false;
    }
  };
  const buttonBlock = () => {
    validateInput();
    document.querySelectorAll("#name-input,#text-input").forEach((el) => {
      el.addEventListener("input", () => {
        validateInput();
      });
    });
  };

  buttonBlock();
  changeLikesListener();
  editComment();
};
// fetchAndRenderComments();
renderApp();