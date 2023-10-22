const infoReservation = ({ reservation }) => {
  const { host } = reservation;
  return /*html*/ `
    <h5 class="card-title">Reserva</h5>
    <div class="p-2 border rounded shadow-sm card-text ">
      🧙‍♂️
      <p>
        codigo reserva:
        <span class="badge text-bg-success rounded-pill"
          >${reservation.id}</span
        >
        <br />

        fecha inicio:
        <span class="badge text-bg-warning"
          >${reservation.dateEntry.replace("T", " ").replace("Z", "")}</span
        >
        
        fecha fin:
        <span class="badge  text-bg-warning"
          >${reservation.dateOutput.replace("T", " ").replace("Z", "")}</span
        >

        <br />
        registrada: ${reservation.register ? "si" : "no"}
      </p>

      huesped responsable:
      <ol>
        <li>nombre: ${host.name}</li>
        <li>documento: ${host.document}</li>
      </ol>
    </div>
  `;
};

export const cardInfoRoom = ({ description, reservations = [] }) => {
  const [reservation] = reservations;
  return /*html*/ `
      <div class="card mb-3 shadow-sm ">
        <div class="card-body row">
          <div class="col-md-6">
            <h5 class="card-title">Informacion y detalles</h5>
            <p class="card-text">${description}</p>
            <p class="card-text">
              <small class="text-muted">by JJMorales</small>
            </p>
          </div>

          <div class="col-md-6">
            ${reservation ? infoReservation({ reservation }) : "<span class='badge text-bg-danger'>sin reserva hoy</span>"}
          </div>
          
        </div>
      </div>
    `;
};
