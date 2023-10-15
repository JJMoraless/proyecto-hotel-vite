import { hotelApi } from "../api";

/**
 * @param {string} selector - Selector CSS para el elemento a seleccionar.
 * @returns {HTMLElement | null} - El elemento seleccionado o null si no se encontró ningún elemento.
 */

const $ = (element) => document.querySelector(element);

const $alertError = $("#register-alert-error");
const $alertOk = $("#register-alert-ok");

$("#btn-registrar").addEventListener("click", async (e = event) => {
  e.preventDefault();
  const form = Object.fromEntries(new FormData(e.target.form));
  try {
    const user = await hotelApi.post("users", { ...form, role: "aprendiz" });
    console.log("🚀 ~ file: auth.js:17 ~ $ ~ user:", user)
    $alertError.classList.add("ocultar");
    $alertOk.classList.remove("ocultar");
  } catch (error) {
    console.log(error)
    $alertOk.classList.add("ocultar");
    return $alertError.classList.remove("ocultar");
  }
});
