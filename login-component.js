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

        setToken("Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k");

        fetchAndRenderComments();
    });

}