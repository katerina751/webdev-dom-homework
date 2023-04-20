import { loginUser, registerUser } from "./api.js";

export function renderLoginComponent({
    appEl,
    setToken,
    fetchAndRenderComments, 
    comments, }) {

    let isCurrentWindow = true;

    let isLoginMode = true;

    const renderForm = () => {

        const listOfComments = comments &&
            comments
                .map((comment, id) => {
                    return `
                    <li class="comment">
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
          </li>
    `;
                })
                .join("");

        console.log(listOfComments);

        const appHtml = `
        <div class="container">
        ${isCurrentWindow
                ? `
                ${listOfComments}
            <button id="toggle-link" class="login-register">
            Чтобы добавить комментарий, ${isCurrentWindow ? 'авторизуйтесь' : 'зарегистрируйтесь'}
            </button>`
                : `
            <div class="login-form">
          <h3 class="login-form-title">Форма ${isLoginMode ? 'входа' : 'регистрации'}</h3>
          ${isLoginMode ? '' :
                    `<input type="text" id="name-input" class="login-form-login" placeholder="Введите имя" />`}
          <input type="text" id="login-input" class="login-form-login" placeholder="Введите логин" />
          <input type="password" id="password-input" class="login-form-password" placeholder="Введите пароль" />
          <button id="login-button" class="login-form-button">${isLoginMode ? 'Войти' : 'Зарегистрироваться'}</button>
          <button id="toggle-button" class="login-register">${isLoginMode ? 'Зарегистрироваться' : 'Авторизоваться'}</button>
        </div>
        <button id="toggle-link" class="login-register">
        ${isCurrentWindow ? '' : 'Перейти к комментариям'}
        </button>`}`;

        appEl.innerHTML = appHtml;

        document.getElementById('toggle-link').addEventListener('click', () => {
            isCurrentWindow = !isCurrentWindow;
            renderForm();
        });

        // Если isCurrentWindow = true, 
        // то выводится список комментариев, и ссылка, что вы можете авторизоваться
        // Если isCurrentWindow = true, 
        // то выводится окно входа
        if (!isCurrentWindow) {
            // Это обработчик кнопки зарегистрироваться/войти. 
            document.getElementById('login-button').addEventListener('click', () => {

                if (isLoginMode) {
                    const login = document.getElementById('login-input').value;
                    const password = document.getElementById('password-input').value;

                    if (!login) {
                        alert('Введите логин');
                        return;
                    }

                    if (!password) {
                        alert('Введите пароль');
                        return;
                    }

                    loginUser({
                        login: login,
                        password: password,
                    }).then((user) => {
                        setToken(`Bearer ${user.user.token}`);
                        fetchAndRenderComments();
                    }).catch(error => {
                        // вывести алерт красиво в окошке
                        alert(error.message);
                    });
                } else {
                    const login = document.getElementById('login-input').value;
                    const name = document.getElementById('name-input').value;
                    const password = document.getElementById('password-input').value;

                    if (!name) {
                        alert('Введите имя');
                        return;
                    }

                    if (!login) {
                        alert('Введите логин');
                        return;
                    }

                    if (!password) {
                        alert('Введите пароль');
                        return;
                    }

                    registerUser({
                        login: login,
                        password: password,
                        name: name,
                    }).then((user) => {
                        setToken(`Bearer ${user.user.token} `);
                        fetchAndRenderComments();
                    }).catch(error => {
                        // вывести алерт красиво в окошке
                        alert(error.message);
                    });
                }
            });

            // Это переключатель кнопки зарегистрироваться/войти. 
            document.getElementById('toggle-button').addEventListener('click', () => {
                isLoginMode = !isLoginMode;
                renderForm();
            });
        } else return;

    };

    renderForm();
};