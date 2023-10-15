import { hotelApi } from "../api";
// import { formaDates } from "./helpers";
const $btnSaveHost = document.querySelector("#btnSaveHost");
const $btnFindHost = document.querySelector("#btn-find-host");

const $formHuesped = document.querySelector("#datos-huesped");
const $formReserva = document.querySelector("#formReserva");

const $inputInDate = document.querySelector("#dateEntry");
const $inputExitDate = document.querySelector("#dateOutput");

const $roomsSelect = document.querySelector("#rooms-select");
const nowDate = new Date().toISOString().split("T")[0];

const $datesVoidsError = document.querySelector("#errorAlertDates");

$inputExitDate.setAttribute("min", nowDate);
$inputInDate.setAttribute("min", nowDate);

const getRoomsAvailable = async (start, end) => {
  const rooms = await hotelApi.get(
    `rooms/available?date_entry=${start}&date_output=${end}`
  );
  return rooms;
};

const fillRooms = async (e = event) => {
  const inDate = $inputInDate.value;
  const outDate = $inputExitDate.value;

  if (!!inDate && !!outDate) {
    const { data } = await getRoomsAvailable(inDate, outDate);
    $roomsSelect.innerHTML = "";
    data.data.rooms.forEach((el) => {
      const $option = document.createElement("option");
      $option.value = el.number;
      $option.textContent = el.number;
      $roomsSelect.appendChild($option);
    });
  }
};

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

const errorAlert = document.querySelector("#errorAlert");
const errorAlertHost = document.querySelector("#errorAlertHost");

export const reservar = async () => {
  const { document = 0 } = Object.fromEntries(new FormData($formHuesped));
  const {
    numChildrens,
    numAdults,
    roomNumber,

    ...dataReservation
  } = Object.fromEntries(new FormData($formReserva));

  console.log("🚀 ~ file: dom.js:22 ~ eventoReservar ~ dataReservations:", {
    ...dataReservation,
    document,
    numChildrens,
    numAdults,
    roomNumber,
  });

  if (new Date($inputInDate.value) > new Date($inputExitDate.value)) {
    errorAlert.classList.remove("ocultar");
    throw new Error("error en las fechas");
  }

  if ($inputInDate.value === "" || $inputExitDate.value === "") {
    $datesVoidsError.classList.remove("ocultar");
    throw new Error("fechas deben estar llenas");
  }
  $datesVoidsError.classList.add("ocultar");
  errorAlert.classList.add("ocultar");
  try {
    const res = await hotelApi.post("/reservations", {
      ...dataReservation,
      numChildrens: Number(numChildrens),
      numAdults: Number(numAdults),
      roomNumber: Number(roomNumber),
      hostDocument: document.toString(),
      userId: 1,
    });
    console.log("🚀 ~ file: dom.js:95 ~ reser ~ res:", res);
  } catch (error) {
    errorAlertHost.classList.remove("ocultar");
    throw new Error("error en el huesped");
  }

  errorAlertHost.classList.add("ocultar");
  await fillRooms();
};

const findHostById = async (e = event) => {
  e.preventDefault();
  const { document: hostDocument } = Object.fromEntries(
    new FormData($formHuesped)
  );

  const {
    data: { data },
  } = await hotelApi.get(`/host/${hostDocument}`);
  
  document.querySelector("#email").value = data.host.email;
  document.querySelector("#name").value = data.host.name;
  document.querySelector("#numberPhone").value = data.host.numberPhone;
};

$inputExitDate.addEventListener("change", fillRooms);
$inputInDate.addEventListener("change", fillRooms);
$btnSaveHost.addEventListener("click", guardarHuesped);
$btnFindHost.addEventListener("click", findHostById);
