import { Calendar } from "fullcalendar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { hotelApi } from "../api";


import bootstrap5Plugin from '@fullcalendar/bootstrap5';

const getReservations = async () => {
  const { data } = await hotelApi.get("reservations/?limit=200");
  return data.data.reservation.map((el) => {
    const color = el.state === "checkIn" ? "#FFA67D" : "#F2D20C"
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
    plugins: [ bootstrap5Plugin ],
    initialView: "dayGridMonth",
    themeSystem: 'bootstrap5',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialDate: '2018-01-12',
    navLinks: true,
    editable: true,
    dayMaxEvents: true, 
    themeSystem: "bootstrap5",
    events: await getReservations(),
  });

  calendar.render();
});
