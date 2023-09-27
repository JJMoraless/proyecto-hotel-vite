import { Calendar } from "fullcalendar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import bootstrap5Plugn from "@fullcalendar/bootstrap5";
const $btnReservar = document.querySelector("#btnReservar");

import "./reserva";
import { hotelApi } from "./api";
import { reservar } from "./reserva";
import { format } from "date-fns";


const getReservations = async () => {
  const { data } = await hotelApi.get("reservations/?limit=100");
  return data.data.reservation.map((el) => {
    const color = el.state === "checkIn" ? "#FFA67D" : "#F2D20C";

    const dateIn = el.dateEntry;
    const dateExit = new Date(el.dateOutput);
    const nexExit = dateExit.setHours(dateExit.getHours() + 10);

    return {
      title: el.roomNumber,
      start: dateIn,
      end: nexExit,
      backgroundColor: color,
      borderColor: "#F5F3F2",
      // allDay: true
    };
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new Calendar(calendarEl, {
    initialView: "dayGridMonth",
    plugins: [bootstrap5Plugn],
    headerToolbar: {
      // left: "prev,next",
      // right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    themeSystem: "bootstrap5",
    events: await getReservations(),
    timeZone: "UTC",
    locale: "es",
    displayEventTime: false,

    // events: [
    //   {
    //     title: "prueba",
    //     start: "2023-10-09",
    //     end: "2023-10-24",
    //     allDay: true,
    //   },
    // ],
  });

  const newDate1 = format(new Date("2023-10-09T00:00:00.000Z"), "yyyy-MM-dd");
  const newDate2 = format(new Date("2023-10-24T00:00:00.000Z"), "yyyy-MM-dd");

  console.log("🚀 ~ file: main.js:58 ~ newDate:", newDate1);
  console.log("🚀 ~ file: main.js:59 ~ newDate2:", newDate2);

  $btnReservar.addEventListener("click", async (e = event) => {
    e.preventDefault();

    try {
      await reservar();
    } catch (error) {
      console.log(error);
      return;
    }

    calendar.removeAllEvents();
    calendar.addEventSource(await getReservations());
    console.log("recarga calendar");
  });

  calendar.render();
});
