const host = "https://webdev-hw-api.vercel.app/api/v2/ekaterina-budylina/comments";

export function getComments({ token, id }) {
    return fetch(host, {
        method: "GET",
        headers: {
            Authorization: token,
        },
        id,
        forceError: true,
    })
        .then((response) => {
            if (response.status === 401) {
                fetchComments();
                throw new Error("Нет авторизации");
            }
            return response.json();
        });
}

export function deleteComment({ token, id, }) {
    return fetch(host + "/" + id, {
        method: "DELETE",
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            return response.json();
        })
}

export function addComment({ name, date, text, forceError, token }) {
    return fetch(host, {
        method: "POST",
        body: JSON.stringify({
            name,
            date,
            text,
            forceError,
        }),
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 201) {
                // mainForm.style.display = "none";
                // loaderPostElement.style.display = "flex";
                // nameInputElement.value = "";
                // textInputElement.value = "";
                return response.json();
            } else if (response.status === 500) {
                alert("Сервер сломался, попробуй позже");
                // return Promise.reject("Сервер упал");
            } else if (response.status === 400) {
                alert("Имя и комментарий должны быть не короче 3 символов");
                // return Promise.reject("Сервер упал");
            }
        })
}

// Ссылка на документацию по авторизации:
// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md

export function registerUser({ login, password, name }) {
    return fetch("https://webdev-hw-api.vercel.app/api/user", {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
            name,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error("Такой пользователь уже существует");
        }
        return response.json();
    });
}

export function loginUser({ login, password }) {
    return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error("Неверный логин или пароль");
        }
        return response.json();
    });
}