import { hotelApi } from "../api";
import { $, $$ } from "../utils/functions";
import {
  cardInfoRoom,
  fillBodyOfTablesConsumed,
  getRowsBodyConsumed,
  headerOfItemAccordion,
  productsOfTableConsumables,
  tableOfAlreadyConsumed,
  tableOfConsumables,
} from ".";
import { format } from "date-fns";
const $roomsInfo = $("#acordion-rooms");

const reFillProductsMinibar = ({
  $bodyTableMinibar,
  productsMinibar,
  registerId,
}) => {
  $bodyTableMinibar.innerHTML = "";
  $bodyTableMinibar.innerHTML = productsOfTableConsumables({
    products: productsMinibar,
    registerId,
  });
};

// Consumibles a registro
const addConsumable = async (e = event) => {
  const $productRow = e.currentTarget.closest(".product-row");
  const $cardBody = e.currentTarget.closest(".card-body");

  const $footer = $cardBody.nextElementSibling;
  const $inputAmount = $footer.querySelector(".form-control");

  const productId = Number($productRow.id);
  const registerId = Number(e.currentTarget.id);
  const amount = Number($inputAmount.value);
  const roomNumber = Number($cardBody.id);

  if (registerId) {
    await hotelApi.post("registers/add-consumable", {
      productId,
      registerId,
      amount,
    });

    const $table = $(`#table-consumed-${registerId}`);
    const resProductsConsumed = await hotelApi.get(
      `registers/${registerId}/products`
    );

    const productsConsumed = resProductsConsumed.data.data.register.products;
    getRowsBodyConsumed({ products: productsConsumed, $table });

    const $bodyTableMinibar = $(`#body-consumables-${roomNumber}`);
    console.log(
      "🚀 ~ file: listOfRooms.jsx:64 ~ addConsumable ~ $bodyTableMinibar:",
      $bodyTableMinibar
    );
    const resProductsminibar = await hotelApi.get(
      `rooms/${roomNumber}/consumables`
    );
    const productsMinibar = resProductsminibar.data.data.room.products;
    reFillProductsMinibar({ productsMinibar, $bodyTableMinibar, registerId });
    addConsumablesToRegister();
  }
};

const addConsumablesToRegister = () => {
  const $btnAddConsumables = $$(".btn-add-consumable-checkIn");
  $btnAddConsumables.forEach((el) => {
    el.addEventListener("click", addConsumable);
  });
};

const productsHandler = async (e = event) => {
  const $roomNumber = $("#modal-room");
  const $registerNumber = $("#modal-register");
  const registerId = Number(e.target.dataset.register);

  $roomNumber.innerHTML = `<span class='badge text-bg-danger'> ${Number(
    e.target.id
  )} </span>`;

  $registerNumber.innerHTML = registerId || "";
  loadProdudtcs(e);
};

// Products
const loadProdudtcs = async (e) => {
  // console.log(e.target)

  const $tableBodyProducts = document.querySelector("#body-products");
  const resProducts = await hotelApi.get("products", {
    params: {
      limit: 10000000,
    },
  });
  
  const products = resProducts.data.data.products;
  $tableBodyProducts.innerHTML = "";
  products.forEach((itemProduct) => {
    const $tr = document.createElement("tr");
    $tr.id = itemProduct.id;
    $tr.innerHTML = /*html*/ `
      <td>${itemProduct.name}</td>
      <td>${itemProduct.price}</td>
      <td class="">
        <button
          id="btn-edit-product"
          type="button"
          class="btn btn-primary btn-add-consumable-checkIn btn-product-form"
          style="
            --bs-btn-padding-y: 0.25rem;
            --bs-btn-padding-x: 0.5rem;
            --bs-btn-font-size: 0.75rem;">
            aditar
        </button>

        <button
          id="btn-delete-products"
          type="button"
          class="btn  btn-danger btn-add-consumable-checkIn btn-product-form"
          style="
            --bs-btn-padding-y: 0.25rem;
            --bs-btn-padding-x: 0.5rem;
            --bs-btn-font-size: 0.70rem;
          "
          >
            eliminar
        </button>

        <button
          id="btn-add-products-minibar"
          type="button"
          class="btn btn-success btn-add-consumable-checkIn btn-product-form"
          style="
            --bs-btn-padding-y: 0.25rem;
            --bs-btn-padding-x: 0.5rem;
            --bs-btn-font-size: 0.70rem;
          "
          >
          agregar
        </button>
      </td>
    `;
    $tableBodyProducts.appendChild($tr);
  });

  const $btnsEditProduct = $$("#btn-edit-product");
  const $btnsDeleteProduct = $$("#btn-delete-products");
  const $btnsAddProductMinibar = $$("#btn-add-products-minibar");
  const $btnAgregarProduct = $("#btn-add-product");

  $btnsDeleteProduct.forEach((item) =>
    item.addEventListener("click", deleteProduct)
  );

  $btnsEditProduct.forEach((item) =>
    item.addEventListener("click", updateProduct)
  );

  $btnsAddProductMinibar.forEach((item) =>
    item.addEventListener("click", addProductMinibar)
  );
  // $btnAgregarProduct.dataset.roomNumber = e.target.id;
  $btnAgregarProduct.addEventListener("click", addProduct);
};

const addProduct = async (e = event) => {
  const $form = $("#form-products");
  const { amount, ...data } = Object.fromEntries(new FormData($form));
  await hotelApi.post("products", { ...data, type: "consumable" });
  loadProdudtcs();
};

const addProductMinibar = async (e = event) => {
  const amount = $("#amountProduct").value;
  const roomNumber = Number($("#modal-room").textContent);
  const productId = Number(e.target.closest("tr").id);
  const $registerNumber = $("#modal-register");
  const registerId = Number(e.target.dataset.register);

  await hotelApi.post(`rooms/add-consumable`, {
    productId,
    roomNumber,
    amount,
  });

  const $bodyTableMinibar = $(`#body-consumables-${roomNumber}`);
  const res = await hotelApi.get(`rooms/${roomNumber}/consumables`);
  const productsMinibar = res.data.data.room.products;

  reFillProductsMinibar({ productsMinibar, registerId, $bodyTableMinibar });
};

const deleteProduct = async (e = event) => {
  const $curretnRow = e.target.closest("tr");
  const idPorduct = Number($curretnRow.id);
  await hotelApi.delete(`products/${idPorduct}`);
  loadProdudtcs();
};

const updateProduct = (e = event) => {
  const $currenteRow = e.target.closest("tr");
  const $cols = $currenteRow.querySelectorAll("td");
  const colName = $cols[0].innerText;
  const colPrice = $cols[1].innerText;
  $cols[0].innerHTML = /*html*/ `
    <td>
      <input class="form-control" style="width: 120px; margin:0px; padding: 3px;" value="${colName}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
    </td>
  `;

  $cols[1].innerHTML = /*html*/ `
    <td>
      <input  type="number" class="form-control" style="width: 70px; margin:0px; padding: 3px;"  value="${colPrice}"  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
    </td>
  `;

  $$(".btn-product-form").forEach((itemBtn) => (itemBtn.disabled = true));

  $cols[2].innerHTML = /*html*/ `
    <button
    id="btn-edit-save-product"
    type="button"
    class="btn btn-primary btn-add-consumable-checkIn"
    style="
      --bs-btn-padding-y: 0.25rem;
      --bs-btn-padding-x: 0.5rem;
      --bs-btn-font-size: 0.75rem;">
      guardar cambios
    </button>
  `;

  const $btnSaveProduct = $("#btn-edit-save-product");
  $btnSaveProduct.addEventListener("click", async (e = event) => {
    const $currenteRowSave = e.target.closest("tr");
    const $colsSave = $currenteRowSave.querySelectorAll("td");
    const idPorduct = Number($currenteRowSave.id);
    const colNameSave = $colsSave[0].querySelector("input").value;
    const colPriceSave = $colsSave[1].querySelector("input").value;
    await hotelApi.put(`/products/${idPorduct}`, {
      name: colNameSave,
      price: colPriceSave,
    });
    loadProdudtcs();
    const roomNumber = Number($("#modal-room").textContent);
    const res = await hotelApi.get(`rooms/${roomNumber}/consumables`);
    const registerId = Number($("#modal-register").textContent);
    const productsMinibar = res.data.data.room.products;
    const $bodyTableMinibar = $(`#body-consumables-${roomNumber}`);
    
    reFillProductsMinibar({ productsMinibar, registerId, $bodyTableMinibar });
  });
};

const btnPorducts = () => {
  const $btnsProducts = $$(".btn-abastecer");
  $btnsProducts.forEach((item) =>
    item.addEventListener("click", productsHandler)
  );
};

const buildTbodyPayments = () => {
  const tBodysPayments = $$(".tbody-payments");

  // Recorre los bodyb de tables
  tBodysPayments.forEach(async (itemTBody) => {
    const idRegister = Number(itemTBody.dataset.register);
    const res = await hotelApi.get(`/registers/${idRegister}/payments`);
    const payments = res.data.data.register.payments;

    // Recorre las cols de las tables
    payments.forEach((paymentItem) => {
      const $tr = document.createElement("tr");
      $tr.innerHTML = /*html*/ `
        <tr>
          <td>${paymentItem.amount}</td>
          <td>${paymentItem.method}</td>
          <td>${format(new Date(paymentItem.createdAt), "MM/dd/yyyy" )}</td>
        </tr>
      `;
      itemTBody.appendChild($tr);
    });
  });
};

const tablePayments = ({ registerId }) => {
  const table = /*html*/ `
    <div class="card shadow-lg ">
      <div class="card-header">
        Abonos del huesped
      </div>
      <div class="card-body table-min-h overflow-y-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>cantidad</th>
              <th>metodo</th>
              <th>fecha</th>
            </tr>
          </thead>

          <tbody data-register="${registerId}"  class="tbody-payments">

          </tbody>
        </table>
      </div>
      <div class="card-footer text-muted">
        <div class="row">
          <div class="col-md-6">
            <label class="form-label">tipo pago</label>
            <select  class="form-select">
              <option value="efectivo">efectivo</option>
              <option value="debito">debito</option>
              <option value="credito">credito</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">cantidad</label>
            <input class="form-control" type="number" />
          </div>

          <div class="col-md-12 mt-3 ">
              <button
                  type="button"
                  class="btn btn-success w-100 btn-add-payment"
                  style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                >
                agregar a abono
              </button>
          </div>


        </div>  
      </div>
    </div>
  `;

  return table;
};

const listOfRooms = async () => {
  const resRooms = await hotelApi.get("rooms");
  const { rooms } = resRooms.data.data;

  const roomsPromise = rooms.map(async (room) => {
    let $itemRoomInfo = document.createElement("div");
    $itemRoomInfo.classList.add("accordion-item");
    const resConsumables = await hotelApi.get(
      `rooms/${room.number}/consumables`
    );
    const { products } = resConsumables.data.data.room;
    const { reservations } = room;
    const [reservation] = reservations;
    const missingRegister = /*html*/ `<span class="badge text-bg-danger rounded-pill">sin checkin</span>`;
    $itemRoomInfo.innerHTML = /*html*/ `
      <div id="acordion-id-${room.number}" class="accordion-item">
        ${headerOfItemAccordion({ ...room })}
        <div
          id="panelsStayOpen-${room.number}"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-${room.number}"
        >
          <div class="accordion-body">
            ${cardInfoRoom({ ...room })}
            <div class="row">

              <div class="col-lg-4" id="table-consumables-${room.number}">
                ${tableOfConsumables({
                  products,
                  roomNumber: room.number,
                  reservation,
                })}
              </div>

              <div class="col-lg-4" id="table-consumed-${room.number}">
                ${
                  !reservation?.register
                    ? missingRegister
                    : tableOfAlreadyConsumed({
                        reservation,
                        registerId: reservation.register.id,
                      })
                }
              </div>

              <div class="col-lg-4">
                ${
                  !reservation?.register
                    ? ""
                    : tablePayments({ registerId: reservation?.register?.id })
                }
              </div>
             
              
            </div>
          </div>
        </div>
      </div>
    `;
    $roomsInfo.appendChild($itemRoomInfo);
  });

  await Promise.all(roomsPromise);
  fillBodyOfTablesConsumed();
  addConsumablesToRegister();
  btnPorducts();
  buildTbodyPayments();
};

document.addEventListener("DOMContentLoaded", listOfRooms);
