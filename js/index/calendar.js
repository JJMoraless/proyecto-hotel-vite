import { Calendar } from "fullcalendar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { hotelApi } from "../api";

import bootstrap5Plugin from "@fullcalendar/bootstrap5";

const getReservations = async () => {
  const { data } = await hotelApi.get("reservations/?limit=200");
  return data.data.reservation.map((el) => {
    const dateIn = el.dateEntry;
    const dateExit = new Date(el.dateOutput);
    const nexExit = dateExit.setHours(dateExit.getHours() + 10);
    console.log(
      "🚀 ~ file: main.js:19 ~ returndata.data.reservation.map ~ dateExit:",
      dateExit
    );

    const color = el.state === "checkIn" ? "#FFA67D" : "#F2D20C";
    return {
      title: el.roomNumber,
      start: dateIn,
      end: nexExit,
      backgroundColor: color,
      borderColor: "#F5F3F2",
    };
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new Calendar(calendarEl, {
    plugins: [bootstrap5Plugin],
    initialView: "dayGridMonth",
    themeSystem: "bootstrap5",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    events: await getReservations(),
    timeZone: "UTC",
    locale: "es",
    displayEventTime: false,
  });

  calendar.render();
});
