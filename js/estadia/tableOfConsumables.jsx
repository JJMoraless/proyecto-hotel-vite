export const productsOfTableConsumables = ({ products, registerId }) => {
  console.log(
    "🚀 ~ file: tableOfConsumables.jsx:4 ~ productsOfTableConsumables ~ registerId:",
    registerId
  );
  return /*html*/ `
    ${products
      .map((product) => {
        return /*html*/ `
          <tr class="product-row" id="${product.id} ">
            <td>
              ${product.name}
              <br />
              <span class="text-muted ">
            
            </td>
            <td>$${product.price}</td>
            <td>
              <button
                id="${registerId}"
                type="button"
                class="btn btn-success btn-add-consumable-checkIn"
                style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
              >
                agregar a huesped
              </button>
            </td>
          </tr>
      `;
      })
      .join("")}
  `;
};

export const tableOfConsumables = ({
  products = [],
  roomNumber,
  reservation,
}) => {
  const registerId = reservation?.register?.id;
  return /*html*/ `
    <div class="card shadow-lg">
      <div class="card-header">consumibles en minibar</div>
      <div id="${roomNumber}" class="card-body table-consumbales overflow-y-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>nombre</th>
              <th>precio</th>
              <th>agregar</th>
            </tr>
          </thead>
          <tbody  id="body-consumables-${roomNumber}">
            ${productsOfTableConsumables({ products, registerId })}
          </tbody>
        </table>
      </div>

      <div class="card-footer text-body-secondary">
        <div class="row">

          <div class="col-md-4">
            <p>cant. consumido</p>
          </div>

          <div class="col-md-8 pb-2 ">
            <input  type="number" class="form-control">
          </div>
          <div class="col-md-12">
            <!-- Button trigger modal -->
            <button
              id="${roomNumber}"
              type="button"
              class="btn btn-success w-100 btn-abastecer"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              data-roomId="${roomNumber}"
              data-register="${registerId}"
              style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
              agregar consumible
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};
