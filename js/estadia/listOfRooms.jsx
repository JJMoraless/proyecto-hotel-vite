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
} from "./";
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
    console.log({
      productId,
      registerId,
      amount,
    });

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

    const $bodyTableMinibar = $(`#body-consumables-${registerId}`);
    const resProductsminibar = await hotelApi.get(
      `rooms/${roomNumber}/consumables`
    );
    const productsMinibar = resProductsminibar.data.data.room.products;
    reFillProductsMinibar({ productsMinibar, $bodyTableMinibar, registerId });
    addConsumablesToRegister()
  }
};

const addConsumablesToRegister = () => {
  const $btnAddConsumables = $$(".btn-add-consumable-checkIn");
  $btnAddConsumables.forEach((el) => {
    el.addEventListener("click", addConsumable);
  });
};




const addConsumablesToMInibar = () => {
  const btnAbastecer = $$(".btn-abastecer")
  console.log("🚀 ~ file: listOfRooms.jsx:82 ~ addConsumablesToMInibar ~ btnAbastecer:", btnAbastecer)
  
  
}





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
      <div class="accordion-item">
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
  addConsumablesToMInibar()
};

listOfRooms();
