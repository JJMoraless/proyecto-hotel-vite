import { hotelApi } from "../api";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getReservationsCheckIn = async () => {
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
      row.innerHTML = `
        <td>${reservation.id}</td>
        <td>${reservation.host ? reservation.host.name : 'en espera'}</td>
        <td>${reservation.host ? reservation.host.numberPhone : 'en espera'}</td>
        <td>${reservation.roomNumber}</td>
        <td>${formatDate(reservation.dateEntry)}</td>
        <td>${formatDate(reservation.dateOutput)}</td>
        <td>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#reservationDetailsModal" onclick="openReservationModal(${JSON.stringify(reservation)})">Ver Detalles</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
  }
};

// Llama a la función para obtener y mostrar las reservas
getReservationsCheckIn();
