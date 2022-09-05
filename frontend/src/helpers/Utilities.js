import { nanoid } from "nanoid";

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
    const { uuid } = localStorageGet("user") || {};
    return uuid ? true : false;
};

export const getNanoId = () => {
    return nanoid();
};

// Generate color for Avatar
const COLORS = {
    A: "#0050b3",
    B: "#91d5ff",
    C: "#08979c",
    D: "#10239e",
    E: "#5cdbd3",
    F: "#1890ff",
    G: "#95de64",
    H: "#ff9c6e",
    I: "#73d13d",
    J: "#1d39c4",
    K: "#13c2c2",
    L: "#eb2f96",
    M: "#7546c9",
    N: "#7cb305",
    O: "#2f54eb",
    P: "#ff85c0",
    Q: "#bae637",
    R: "#722ed1",
    S: "#faad14",
    T: "#36cfc9",
    U: "#ffc53d",
    V: "#b37feb",
    W: "#cf1322",
    X: "#096dd9",
    Y: "#d3adf7",
    Z: "#fadb14",
};

export const getColor = (paramName = undefined) => {
    const { name } = localStorageGet("user") || {};

    const Name = paramName ? paramName : name;

    if (Object.prototype.toString.call(Name) !== "[object String]" || !Name) {
        const key = getRandomColorKey();
        return COLORS[key];
    }

    return COLORS[Name.charAt(0).toUpperCase()];
};

const getRandomColorKey = () => {
    const keyArr = Object.keys(COLORS);
    const randomKey = Math.floor(Math.random() * Object.keys(COLORS).length);

    return keyArr[randomKey];
};
