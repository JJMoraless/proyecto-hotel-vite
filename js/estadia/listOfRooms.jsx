import { hotelApi } from "../api";
import { $ } from "../utils/functions";
const $roomsInfo = $("#acordion-rooms");

const loadRooms = async () => {
  const resRooms = await hotelApi.get("rooms");
  const { rooms } = resRooms.data.data;
  

  rooms.forEach((room) => {
    const $itemRoomInfo = document.createElement("div");
    $itemRoomInfo.classList.add("accordion-item");

    $itemRoomInfo.innerHTML = /*html*/ `
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseOne"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
           habitacion ${room.number}
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-headingOne"
        >
          <div class="accordion-body">
            ${room.description}
          </div>
        </div>
      </div>
    `;

    $roomsInfo.appendChild($itemRoomInfo);
  });
};

loadRooms();
