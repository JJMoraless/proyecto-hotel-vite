import { Calendar } from "fullcalendar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import bootstrap5Plugn from "@fullcalendar/bootstrap5";

import { hotelApi } from "./api";
import { reservar } from "./reserva";
import { format } from "date-fns";

import "./reserva";
import { $ } from "./utils/functions";
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
            <span class="badge text-bg-success id-reserva"> 
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
          <div class="col-md-6  p-3 shadow-sm rounded border">
            <h5  class="pb-3">Reserva</h5>
        
            <ul class="list-group list-group-fechas list-group-item-action">
              <li class="list-group-item room">
                <b> habitacion: ${el.roomNumber} </b>
              </li>

              <li class="list-group-item entrada">
                fecha de entrada:
                <span class="fecha">
                  ${format(new Date(el.dateEntry).setHours(24), "yyyy/MM/dd")}
                </span>
              </li>

              <li class="list-group-item salida">
                fecha de salida:
                <span class="fecha">
                  ${format(new Date(el.dateOutput), "yyyy/MM/dd")}
                </span>
              </li>


              <li class="list-group-item btn-guardar">
                <button
                  id="btn-edit-reserva"
                  type="button"
                  class="btn btn-primary btn-add-consumable-checkIn"
                  style="
                    --bs-btn-padding-y: 0.25rem;
                    --bs-btn-padding-x: 0.5rem;
                    --bs-btn-font-size: 0.75rem;">
                    editar
                </button>
              </li>
            </ul>

            <br />
              
            <div
              id="errorAlert"
              class="alert ocultar alert-danger animate__animated animate__fadeInDown  alerta-fecha-editar"
              role="alert"
            >
               💀 Error fecha de salida debe ser mas grande que entrada 
            </div>

            <div
              id="errorAlert"
              class="alert ocultar alert-success animate__animated animate__fadeInDown  alerta-gree-fecha-editar"
              role="alert"
            >
              🪄🤖 fechas actualizadas
            </div>
          </div>
        </div>
      `,
    };
  });
};

const editReserva =   (calendar) => {
  const $btnEditReservation = $("#btn-edit-reserva");
  const $bodytarget = $btnEditReservation.closest(".modal-body");
  const idReservation = Number(
    $bodytarget.querySelector(".id-reserva").textContent
  );
  const $reservation = $bodytarget.querySelector(".list-group-fechas");
  console.log("🚀 ~ file: main.jsx:129 ~ editReserva ~ $reservation:", $reservation)
  

  $btnEditReservation.addEventListener("click", (e = event) => {
    const $salida = $reservation.querySelector(".salida");
    const $entrada = $reservation.querySelector(".entrada");
    const $btnGuardar = $reservation.querySelector(".btn-guardar");
    const $alerta = $bodytarget.querySelector(".alerta-fecha-editar");
    const $alertaGreen = $bodytarget.querySelector(".alerta-gree-fecha-editar");
    
    
    // console.log("🚀 ~ file: main.jsx:136 ~ $btnEditReservation.addEventListener ~  $alerta:",  $alerta)

    const fechaSalida = $salida
      .querySelector(".fecha")
      .textContent.trim()
      .replace("/", "-")
      .replace("/", "-");
    const fechaEntrada = $entrada
      .querySelector(".fecha")
      .textContent.trim()
      .replace("/", "-")
      .replace("/", "-");

    console.log(
      "🚀 ~ file: main.jsx:132 ~ $btnEditReservation.addEventListener ~ $btnGuardar:",
      $btnGuardar
    );

    $salida.innerHTML = /*html*/ `
      <p>fecha de salida: </p> 
      <input type="date" name="" id="" class="form-control salida-save"  value="${fechaSalida}"/>
    `;

    $entrada.innerHTML = /*html*/ `
      <p>fecha de entrada: </p> 
      <input type="date" name="" id="" class="form-control entrada-save" value="${fechaEntrada}" />
    `;

    $btnGuardar.innerHTML = /*html*/ `
      <button
        id="btn-edit-reserva"
        type="button"
        class="btn btn-primary btn-guardar-fechas"
        style="
          --bs-btn-padding-y: 0.25rem;
          --bs-btn-padding-x: 0.5rem;
          --bs-btn-font-size: 0.75rem;">
          guardar cambios
      </button>
    `;

    const $btnGuardarFechas = $(".btn-guardar-fechas");

    $btnGuardarFechas.addEventListener("click", async (e = event) => {
      const entrada = new Date( $reservation.querySelector(".entrada-save").value);
      const salida =  new Date($reservation.querySelector(".salida-save").value);
      salida.setHours(salida.getHours() + 23, 59, 0, 0);
      
      if(entrada > salida) {
        $alerta.classList.remove("ocultar")
        setTimeout(() => {
          $alerta.classList.remove("animate__fadeInDown")
          $alerta.classList.add("animate__backOutLeft")
          setTimeout(() => {
            $alerta.classList.add("ocultar")
            $alerta.classList.add("animate__fadeInDown")
          },1000)
        }, 2000)
        return 
      }

      try {
        $alertaGreen.classList.remove("ocultar")
        hotelApi.put(`reservations/${idReservation}`, {
          dateEntry: entrada,
          dateOutput: salida,
        });
        setTimeout(() => {
          $alertaGreen.classList.remove("animate__fadeInDown")
          $alertaGreen.classList.add("animate__backOutLeft")
          setTimeout(() => {
            $alertaGreen.classList.add("ocultar")
            $alertaGreen.classList.add("animate__fadeInDown")
          },1500)
        }, 1000)
        calendar.removeAllEvents();
        calendar.addEventSource(await getReservations());
      } catch (error) {
        console.log("error", error)
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");
  let eventModal = new bootstrap.Modal(document.getElementById("eventModal"));
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
      let eventElement = info.el;
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
      editReserva(calendar);
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
  });

  calendar.render();
});
