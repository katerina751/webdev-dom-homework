const host = "https://webdev-hw-api.vercel.app/api/v2/ekaterina-budylina/comments";

export function getComments({ token }) {
    return fetch(host, {
        method: "GET",
        headers: {
            Authorization: token,
        },
        // forceError: true,
    })
        .then((response) => {
            if (response.status === 401) {
                // fetchAndRenderComments();
                throw new Error("Нет авторизации");
            }
            return response.json();
        });
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

export function loginUser({ login, password }) {
    return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        return response.json();
    });
}