// The API we will interact with has an /auth/local/register endpoint that accepts POST requests to register a user

// Specify the BASE_URL for the API.
export const BASE_URL = "https://api.nomoreparties.co";

// The register function accepts the necessary data as arguments,
// and sends a POST request to the given endpoint.
export const register = (username, password, email) => {
  return fetch(`${BASE_URL}/auth/local/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  })
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
    })
};