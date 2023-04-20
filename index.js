import { addComment, deleteComment, getComments } from "./api.js";
import { renderLoginComponent } from "./login-component.js";



let comments = [];
let token = null;


// Получаем данные из хранилища

const fetchComments = () => {

  const loaderStartElement = document.getElementById("loader-start");
  console.log(loaderStartElement);
  // loaderStartElement.style.display = "inline";

  // fetch - запускает запрос в api
  return getComments({ token })
    .then((responseData) => {
      const options = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        timezone: "UTC",
        hour: "numeric",
        minute: "2-digit",
      };

      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;"),
          date: new Date(comment.date).toLocaleString("ru-RU", options),
          text: comment.text
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;"),
          likes: comment.likes,
          isLiked: false,
          id: comment.id,
        };

      });

      console.log(loaderStartElement);

      comments = appComments;

      // получили данные и рендерим их в приложении
      renderApp();
    })
    .then(() => {
      // loaderStartElement.style.display = "none";
    })
    .catch((error) => {
      // loaderStartElement.style.display = "none";
      alert("Кажется, что-то пошло не так, попробуйте позже");
      // TODO: Отправлять в систему сбора ошибок
      console.warn(error);
    });
};


//рендер-функция

const renderApp = () => {
  const appEl = document.getElementById("app");

  if (!token) {

    renderLoginComponent({
      setName: (newName) => {
        name = newName;
      },
      appEl,
      setToken: (newToken) => {
        token = newToken;
      },
      renderApp,
      comments,
    });

    return;
  }

  const commentsHtml = comments
    .map((comment, id) => {
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
            <span class="likes-counter">${comment.likes}</span>
            <button data-index = '${id}' class="${comment.isLiked ? "like-button -active-like" : "like-button"
        }"></button>
          </div>
        </div>
        <div class="delete-row">
          <button data-id="${comment.id}" class="delete-button">Удалить</button>
        </div>
      </li>`;
    })
    .join("");

  const appHtml = `
    <div class="container">
    <p id="loader-start" style="display: none">Пожалуйста, подождите, загружаю комментарии...</p>
    <ul id="list" class="comments">
      <!-- Список рендерится из JS -->
      ${commentsHtml}
    </ul>
    <div>
    <!-- <p id="loader-post" style="display: none">Комментарий добавляется...</p>-->
    </div>
    <div class="add-form">
      <input type="textarea" id="name-input" class="add-form-name" value = "${name}" disabled />
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
  const deleteButtons = document.querySelectorAll(".delete-button");

  // Удаление комментария

  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const id = deleteButton.dataset.id;

      // Подписываемся на успешное завершение запроса с помощью then
      deleteComment({ token, id })
        .then((responseData) => {
          // Получили данные и рендерим их в приложении
          comments = responseData.comments;
          fetchComments();
        });
      renderApp();
    });
  }

  //Добавление комментария

  buttonElement.addEventListener("click", () => {
    nameInputElement.classList.remove("error");
    textInputElement.classList.remove("error");

    if (nameInputElement.value === "" || textInputElement.value === "") {
      nameInputElement.classList.add("error");
      textInputElement.classList.add("error");
      return;
    }
    const loaderPostElement = document.getElementById("loader-post");
    console.log(loaderPostElement);

    addComment({
      name: nameInputElement.value,
      date: new Date(),
      text: textInputElement.value,
      forceError: true,
      token,
    })
      .then(() => {
        return fetchComments();
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


  // Оживляем кнопку лайков

  const changeLikesListener = () => {
    const buttonLikeElements = document.querySelectorAll(".like-button");

    for (const buttonLikeElement of buttonLikeElements) {
      buttonLikeElement.addEventListener("click", (event) => {
        event.stopPropagation();
        const index = buttonLikeElement.dataset.index;

        if (comments[index].isLiked === false) {
          comments[index].isLiked = true;
          comments[index].likes += 1;
        } else if (comments[index].isLiked === true) {
          comments[index].isLiked = false;
          comments[index].likes -= 1;
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
fetchComments();
renderApp();