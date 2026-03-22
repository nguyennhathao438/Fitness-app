import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echo = null;

export const initEcho = (token) => {
  if (echo) {
    echo.disconnect();
  }

  echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,

    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT),

    forceTLS: false,
    enabledTransports: ["ws"],

    authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",

    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  window.Echo = echo;
};

export const getEcho = () => echo;