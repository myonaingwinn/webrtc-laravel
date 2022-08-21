// env
export const baseUrl =
    process.env.REACT_APP_BASE_URL ||
    "https://laravel-server-17-aug.herokuapp.com/api/v1";

export const signalServerUrl =
    process.env.REACT_APP_SIGNAL_SERVER ||
    "https://webrtc-server-17-aug.herokuapp.com";

// local storage
export const localStorageSet = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const localStorageGet = (key) => {
    let parsed = null;
    const item = localStorage.getItem(key);

    try {
        parsed = JSON.parse(item);
    } catch (e) {
        console.log("catch : ", parsed);
    }
    return parsed;
};

export const localStorageRemove = (key) => {
    localStorage.removeItem(key);
};

// authentication
export const isLoggedIn = () => {
    const user = localStorageGet("user");
    return user && user.id ? true : false;
};
