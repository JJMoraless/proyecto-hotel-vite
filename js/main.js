import { Calendar } from "fullcalendar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import bootstrap5Plugn from "@fullcalendar/bootstrap5";
const $btnReservar = document.querySelector("#btnReservar");

import "./reserva";
import { hotelApi } from "./api";
import { reservar } from "./reserva";
const getReservations = async () => {
  const { data } = await hotelApi.get("reservations/?limit=200");
  return data.data.reservation.map((el) => {
    const color = el.state === "checkIn" ? "#FFA67D" : "#F2D20C";
    return {
      title: el.roomNumber,
      start: el.dateEntry,
      end: el.dateOutput,
      backgroundColor: color,
      borderColor: "#F5F3F2",
    };
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new Calendar(calendarEl, {
    plugins: [bootstrap5Plugn],
    initialView: "dayGridMonth",
    headerToolbar: {
      // left: "prev,next",
      // center: "title",
      // right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    themeSystem: "bootstrap5",
    events: await getReservations(),
  });

  $btnReservar.addEventListener("click", async (e = event) => {
    e.preventDefault();
    calendar.removeAllEvents();

    try {
      await reservar();
    } catch (error) {
      const hostDocumentError = error.response.data.errors.find(
        (el) => el.path === "hostDocument"
      );

      if(hostDocumentError){
        
      }

      

     
    }

    calendar.addEventSource(await getReservations());
    console.log("recarga calendar");
  });

  calendar.render();
});
