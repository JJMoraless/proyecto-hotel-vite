import { hotelApi } from "../api";
import { $$ } from "../utils/functions";


export const getRowsBodyConsumed = ({ products = [], $table }) => {
  $table.innerHTML = ""
  return products.forEach((product) => {
    const $tr = document.createElement("tr");
    $tr.innerHTML = /*html*/ `
      <td>${product.name}</td>
      <td>$${product.price}</td>
      <td>#${product.RegisterProduct.amount}</td>
      <td>$${product.RegisterProduct.total}</td>
    `;
    $table.appendChild($tr);
  });
};

// esta funcion se manda a llamar en el modulo listOfRooms
export const fillBodyOfTablesConsumed = () => {
  const $bodysOfTablesConsumed = $$(".table-consumed");
  const $$bodyTables = [...$bodysOfTablesConsumed];
  $$bodyTables.map(async ($table) => {
    const registerId = $table.id.split("-").pop();
    const resRegister = await hotelApi.get(`registers/${registerId}/products`);
    const { products  } = resRegister.data.data.register;
    getRowsBodyConsumed({ products, $table });
  });
};

export const tableOfAlreadyConsumed = ({ reservation, registerId }) => {
  return /*html*/ `
      <div class="card shadow-sm">
        <div class="card-header">consumido por el huesped</div>
        <div class="card-body table-consumbales overflow-y-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>val unid.</th>
                <th>Cant.</th>
                <th>Total.</th>
              </tr>
            </thead>

            <tbody class="table-consumed" id="table-consumed-${registerId}">
            </tbody>

          </table>
        </div>
      </div>
    `;
};