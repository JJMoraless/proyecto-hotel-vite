import { hotelApi } from "../api";
const $btnSaveHost = document.querySelector("#btnSaveHost");
const $formHuesped = document.querySelector("#datos-huesped");
const $formReserva = document.querySelector("#formReserva");

const guardarHuesped = async (e = event) => {
  e.preventDefault();
  const { document, ...dataForm } = Object.fromEntries(
    new FormData($formHuesped)
  );

  const res = await hotelApi.post("host", {
    ...dataForm,
    document: document.toString(),
  });

  console.log("🚀 ~ file: dom.js:14 ~ guardarHuesped ~ res:", res);
};

export const reservar = async () => {
  const { document = 0 } = Object.fromEntries(new FormData($formHuesped));
  const { numChildrens, numAdults, roomNumber, ...dataReservation } =
    Object.fromEntries(new FormData($formReserva));

  console.log("🚀 ~ file: dom.js:22 ~ eventoReservar ~ dataReservations:", {
    ...dataReservation,
    document,
    numChildrens,
    numAdults,
    roomNumber,
  });

  const res = await hotelApi.post("/reservations", {
    ...dataReservation,
    numChildrens: Number(numChildrens),
    numAdults: Number(numAdults),
    roomNumber: Number(roomNumber),
    hostDocument: document.toString(),
    userId: 1,
  });

  console.log("🚀 ~ file: dom.js:33 ~ eventoReservar ~ res:", res);
};

$btnSaveHost.addEventListener("click", guardarHuesped);
