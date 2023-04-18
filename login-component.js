import { loginUser } from "./api.js";

export function renderLoginComponent({ appEl, setToken, fetchAndRenderComments, }) {
    let isLoginMode = false;

    const renderForm = () => {
        const appHtml = `
        <div class="container">
        <div class="login-form">
          <h3 class="login-form-title">Форма ${isLoginMode ? 'входа' : 'регистрации'}</h3>
          ${isLoginMode ? '' :
                `<input type="text" id="name-input" class="login-form-login" placeholder="Введите имя" />`}
          <input type="text" id="login-input" class="login-form-login" placeholder="Введите логин" />
          <input type="password" id="password-input" class="login-form-password" placeholder="Введите пароль" />
          <button id="login-button" class="login-form-button">${isLoginMode ? 'Войти' : 'Зарегистрироваться'}</button>
          <button id="toggle-button" class="login-register">${isLoginMode ? 'Зарегистрироваться' : 'Авторизоваться'}</button>
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

        document.getElementById('toggle-button').addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            renderForm();
        });
    };

    renderForm();
}