import { Calendar } from "fullcalendar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import bootstrap5Plugn from "@fullcalendar/bootstrap5";

import { hotelApi } from "./api";
import { reservar } from "./reserva";
import { format } from "date-fns";

import "./reserva";
const $btnReservar = document.querySelector("#btnReservar");

const getReservations = async () => {
  const { data } = await hotelApi.get("reservations/?limit=100", {
    params: { state: "checkIn" },
  });

  return data.data.reservation.map((el) => {
    const infoRegister = () => {
      return /*html*/ `
        motivo viaje : ${el.register.travel_reason}
      `;
    };

    const color = el.state === "checkIn" ? "#FFA67D" : "#F2D20C";
    const host = el.host.name;
    const dateIn = el.dateEntry;
    const dateExit = new Date(el.dateOutput);

    return {
      title: "🧙‍♂️📜 Room: " + el.roomNumber + " - " + host,
      start: dateIn,
      end: dateExit,
      color,
      description: /*html*/ `

        <div class="row">
          <div className="col-md-12">
            codigo reserva :  
            <span class="badge text-bg-success"> 
              ${el.id} 
            </span>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <h5 class="pt-3">Huesped responsable: </h5> 
            <li>Nombre: ${el.host.name}</li>
            <li>Documento: ${el.host.document}</li>
            <li>Tel: ${el.host.numberPhone} </li>
            <li>Email: ${el.host.email}  </li>

            <li>Acompañantes:
              <select class="border rounded p-1">
                <option value="2">no</option>
                <option value="1">si</option>
              </select>
            </li>

            <hr/>
              regitrado: ${el.register ? "si" : "no"}
            <br/>

            ${el.register?.travel_reason ? infoRegister() : ""}
          </div>

          <!-- Datos editables -->
          <div class="col-md-6 short-inter p-3 shadow-sm rounded border">
            <h5  class="pb-3">Reserva</h5>

            <p>
              fecha de entrada:
              ${format(new Date(el.dateEntry).setHours(24), "MM/dd/yyyy")}
            </p>

            <p>
              fecha de salida:
              ${format(new Date(el.dateOutput), "MM/dd/yyyy")}
            </p>

            <p>
              habitacion:
              ${el.roomNumber}  
            </p>

            <!-- Editar Reserva-->
            <button
              id="btn-edit-save-product"
              type="button"
              class="btn btn-primary btn-add-consumable-checkIn"
              style="
                --bs-btn-padding-y: 0.25rem;
                --bs-btn-padding-x: 0.5rem;
                --bs-btn-font-size: 0.75rem;">
                editar
            </button>
            <br />
            

            






          </div>
        </div>
      `,
    };
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  let eventModal = new bootstrap.Modal(document.getElementById("eventModal"), {
    // backdrop: "static",
    // keyboard: false,
  });

  let eventModalLabel = document.getElementById("eventModalLabel");
  let eventModalBody = document.getElementById("eventModalBody");

  const calendar = new Calendar(calendarEl, {
    initialView: "dayGridMonth",
    plugins: [bootstrap5Plugn],
    headerToolbar: {
      // left: "prev,next",
      // right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    eventMouseEnter: function (info) {
      var eventElement = info.el;
      eventElement.style.cursor = "pointer"; // Cambia el cursor
    },
    themeSystem: "bootstrap5",
    events: (await getReservations()) || [],
    timeZone: "UTC",
    locale: "es",
    displayEventTime: false,
    eventClick: function (info) {
      eventModalLabel.textContent = info.event.title;
      eventModalBody.innerHTML = info.event.extendedProps.description;
      eventModal.show();
    },
  });

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
