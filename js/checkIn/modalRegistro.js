import { hotelApi } from "../api";
import { getReservationsCheckIn } from "./getReservas";

// Función para abrir el modal y llenar los campos con los datos de la reserva
function openReservationModal(reservationId) {
  const getReservationById = async (reservationId) => {
    const mensajeRegistro = (document.getElementById(
      "mensajeRegistro"
    ).style.display = "none");
    try {
      const response = await hotelApi.get(`reservations/${reservationId}`);
      const reservation = response.data.data.reservation || null;

      if (reservation) {
        // Llenar los campos del modal con los datos de la reserva
        document.getElementById("hostDocument").value =
          reservation.host.document || "";
        document.getElementById("hostDocumentType").value =
          reservation.host.document_type || "";
        document.getElementById("hostName").value = reservation.host.name || "";
        document.getElementById("hostBirthdate").value = reservation.host
          .birthdayDate
          ? reservation.host.birthdayDate.substring(0, 10)
          : "";
        document.getElementById("hostPhone").value =
          reservation.host.numberPhone || "";
        document.getElementById("hostEmail").value =
          reservation.host.email || "";
        document.getElementById("hostAddress").value =
          reservation.host.addres || "";
        document.getElementById("hostCity").value = reservation.host.city || "";
        document.getElementById("hostCountry").value =
          reservation.host.country || "";
        document.getElementById("hostOccupation").value =
          reservation.host.occupation || "";
        document.getElementById("hostCompany").value =
          reservation.host.company || "";
        document.getElementById("numReserva").value = reservationId || "";

        document.getElementById("entryDate").value = reservation.dateEntry
          ? reservation.dateEntry.substring(0, 10)
          : "";
        document.getElementById("departureDate").value = reservation.dateOutput
          ? reservation.dateOutput.substring(0, 10)
          : "";

        // Calcular la diferencia en días entre las fechas de entrada y salida
        const entryDate = new Date(reservation.dateEntry);
        const departureDate = new Date(reservation.dateOutput);
        const timeDifference = departureDate.getTime() - entryDate.getTime();
        const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

        // Establecer el valor del campo "Permanencia" con el número de noches
        document.getElementById("permanence").value = nights.toString();

        document.getElementById("motive").value = ""; // Agrega el motivo si está disponible
        document.getElementById("place").value = ""; // Agrega el establecimiento si está disponible
      } else {
        console.log("Reserva no encontrada");
      }
    } catch (error) {
      console.error("Error al buscar la reserva por ID:", error);
    }
  };

  // Llama a la función para obtener y llenar los datos de la reserva
  getReservationById(reservationId);
}

// Agrega un evento de clic a los botones "Opciones" dentro de la tabla
document.addEventListener("click", function (event) {
  if (event.target && event.target.dataset.reservationId) {
    const reservationId = event.target.dataset.reservationId;
    openReservationModal(reservationId);
  }
});

//Boton Modificar
document
  .getElementById("btnHabilitarEdicion")
  .addEventListener("click", function () {
    document.getElementById("hostDocumentType").disabled = false;
    document.getElementById("hostName").disabled = false;
    document.getElementById("hostBirthdate").disabled = false;
    document.getElementById("hostPhone").disabled = false;
    document.getElementById("hostEmail").disabled = false;
    document.getElementById("hostAddress").disabled = false;
    document.getElementById("hostCity").disabled = false;
    document.getElementById("hostCountry").disabled = false;
    document.getElementById("hostOccupation").disabled = false;
    document.getElementById("hostCompany").disabled = false;
    document.getElementById("btnActualizarHuesped").disabled = false;

    //Mensaje de edicion habilitada
    this.innerText = "Edición Habilitada";
  });

//boton Actualizar
document
  .getElementById("btnActualizarHuesped")
  .addEventListener("click", async () => {
    const hostDocument = document.getElementById("hostDocument").value;
    const hostDocumentType = document.getElementById("hostDocumentType").value;
    const hostName = document.getElementById("hostName").value;
    const hostBirthdate = document.getElementById("hostBirthdate").value;
    const hostPhone = document.getElementById("hostPhone").value;
    const hostEmail = document.getElementById("hostEmail").value;
    const hostAddress = document.getElementById("hostAddress").value;
    const hostCity = document.getElementById("hostCity").value;
    const hostCountry = document.getElementById("hostCountry").value;
    const hostOccupation = document.getElementById("hostOccupation").value;
    const hostCompany = document.getElementById("hostCompany").value;

    const updatedHostData = {
      document_type: hostDocumentType,
      name: hostName,
      birthdayDate: hostBirthdate,
      numberPhone: hostPhone,
      email: hostEmail,
      addres: hostAddress,
      city: hostCity,
      country: hostCountry,
      occupation: hostOccupation,
      company: hostCompany,
    };

    try {
      const response = await hotelApi.put(
        `host/${hostDocument}`,
        updatedHostData
      );
      if (response.status === 200) {
        console.log("Actualizacion exitosa");
        //mensaje
        document.getElementById("mensajeHuesped").style.display = "block";
        //deshabilitar campos
        document.getElementById("hostDocumentType").disabled = true;
        document.getElementById("hostName").disabled = true;
        document.getElementById("hostBirthdate").disabled = true;
        document.getElementById("hostPhone").disabled = true;
        document.getElementById("hostEmail").disabled = true;
        document.getElementById("hostAddress").disabled = true;
        document.getElementById("hostCity").disabled = true;
        document.getElementById("hostCountry").disabled = true;
        document.getElementById("hostOccupation").disabled = true;
        document.getElementById("hostCompany").disabled = true;
        document.getElementById("btnActualizarHuesped").disabled = true;
        //boton modificar
        document.getElementById("btnHabilitarEdicion").innerText = "Modificar";
      } else {
        console.log("Error al actualizar");
      }
    } catch (error) {
      console.log("Error al realizar solicitud PUT:", error);
    }
  });

// Agrega un manejador de eventos al botón "Ingresar"
document.getElementById("btnCheckIn").addEventListener("click", async () => {
  const reservationIdString = document.getElementById("numReserva").value;
  const reservationId = parseInt(reservationIdString, 10);
  const userId = 1; // userID temporal
  const travel_reason = document.getElementById("motive").value;

  try {
    // Realiza una solicitud POST a la base de datos
    const response = await hotelApi.post("registers", {
      userId,
      reservationId,
      travel_reason,
    });

    // Verifica la respuesta y maneja cualquier resultado necesario
    if (response.status === 200) {
      console.log("Solicitud POST exitosa");
      //mensaje de post
      const mensajeRegistro = (document.getElementById(
        "mensajeRegistro"
      ).style.display = "block");
      getReservationsCheckIn();
    } else {
      console.error("Error en la solicitud POST");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud POST:", error);
  }
});
