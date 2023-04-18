import { loginUser } from "./api.js";

export function renderLoginComponent({ appEl, setToken, fetchAndRenderComments, }) {
    const appHtml = `
    <div class="container">
    <div class="login-form">
      <h3 class="login-form-title">Форма входа</h3>
      <input type="text" id="login-input" class="login-form-login" placeholder="Введите логин" />
      <input type="password" id="password-input" class="login-form-password" placeholder="Введите пароль" />
      <!-- <input type="text" id="name-input" class="login-form-name" placeholder="Введите ваше имя" /> -->
      <button id="login-button" class="login-form-button">Войти </button>
      <a class="login-register" href="#">Зарегистрироваться</a>
    </div>`;

    appEl.innerHTML = appHtml;

    document.getElementById('login-button').addEventListener('click', () => {

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
    });

}