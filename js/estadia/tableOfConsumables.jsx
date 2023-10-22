import { $ } from "../utils/functions";

export const productsOfTableConsumables = ({ products, registerId }) => {
  return /*html*/ `
    ${products
      .map((product) => {
        return /*html*/ `
          <tr class="product-row" id="${product.id} ">
            <td>
              ${product.name}
              <br />
              <span class="text-muted ">
              <span class="badge text-bg-success rounded-pill"
                >Cant: #${product.Inventary.amount}</span>
              </span>
            </td>
            <td>$${product.price}</td>
            <td>
              <button
                id="${registerId}"
                type="button"
                class="btn btn-success btn-add-consumable-checkIn"
                style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
              >
                agregar a registro
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
      <div class="card shadow-sm">
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
            <tbody  id="body-consumables-${registerId}">
              ${productsOfTableConsumables({ products, registerId })}
            </tbody>
          </table>
        </div>

        <div class="card-footer text-body-secondary">
          <div class="row">
  
            <div class="col-md-4">
              <p><b>cantidad</b></p>
            </div>
  
            <div class="col-md-8 pb-2 ">
              <input  type="number" class="form-control">
            </div>
            <div class="col-md-12">
              <!-- Button trigger modal -->
              <button
                type="button"
                class="btn btn-success w-100 btn-abastecer"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                abastecer
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
};
