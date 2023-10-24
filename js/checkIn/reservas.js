
import { hotelApi } from "../api";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getReservationsCheckIn = async () => {
  try {
    const response = await hotelApi.get("reservations/?limit=200");
    const reservations = response.data.data.reservation || [];

    // Obtiene una referencia al cuerpo de la tabla en el HTML
    const tableBody = document.getElementById('table-body-reservations');

    // Limpia cualquier contenido previo en la tabla
    tableBody.innerHTML = '';
  

    // Itera a través de los datos de las reservas y agrega filas a la tabla
    for (const reservation of reservations) {
      const row = document.createElement('tr');
      row.innerHTML =/*html*/ `
        <td>${reservation.id}</td>
        <td>${reservation.host ? reservation.host.name : ''}</td>
        <td>${reservation.host ? reservation.host.numberPhone : ''}</td>
        <td>${reservation.roomNumber}</td>
        <td>${formatDate(reservation.dateEntry)}</td>
        <td>${formatDate(reservation.dateOutput)}</td>
        <td>
          <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#reservationDetailsModal" data-reservation-id="${reservation.id}">Registrar</button>
        </td>
        <td>
          <button class="btn btn-danger delete-reservation" data-reservation-id="${reservation.id}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
  }
};

// Llama a la función para obtener y mostrar las reservas cuando se cargue la página
window.addEventListener('load', getReservationsCheckIn);

// Función para eliminar una reserva
async function deleteReservation(reservationId) {
  try {
    const response = await hotelApi.delete(`reservations/${reservationId}`);
    if (response.status === 200) {
      console.log('Reserva eliminada con éxito');
      getReservationsCheckIn();
    } else {
      console.error('Error al eliminar la reserva');
    }
  } catch (error) {
    console.error('Error al realizar la solicitud DELETE:', error);
  }
}

// Agrega un evento de clic a los botones "Eliminar" dentro de la tabla
document.addEventListener('click', function (event) {
  if (event.target && event.target.classList.contains('btn-danger')) {
    const reservationId = parseInt(event.target.dataset.reservationId);
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      deleteReservation(reservationId);
    }
  }
});
