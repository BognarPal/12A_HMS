import { RoomsAdminPage } from "../rooms_admin_page.js";
import { Roomtype } from "./roomtype.js";

export class RoomtypeSelector {
    parentPage: RoomsAdminPage;
    roomtypes: Roomtype[] = new Array<Roomtype>();

    constructor(parentPage: RoomsAdminPage) {
        this.parentPage = parentPage;
        this.initializeWindow();
    }

    private initializeWindow() {
        getRoomTypes(this.parentPage)
            .then((result) => {
                this.roomtypes = result;
                fillSelectorContainer(this.roomtypes);
                this.addEventListeners();
            });
    }

    private deleteRoomtype(roomtypeId: string) {
        const requestOptions: RequestInit = {
            method: "DELETE",
            headers: { "Authorization": this.parentPage.token },
            redirect: "follow" as RequestRedirect | undefined
        }

        fetch(`https://hms.jedlik.cloud/api/rooms/types/${roomtypeId}`, requestOptions)
            .then((response) => response.text())
            .then(() => this.initializeWindow())
    }

    private modifyRoomtype(roomtypeId: string) {
        var selectedRoomtype : Roomtype;

        var requestOptions: RequestInit = {
            method: "GET",
            headers: { "Authorization": this.parentPage.token },
            redirect: "follow" as RequestRedirect | undefined
        }
        fetch(`https://hms.jedlik.cloud/api/rooms/types/${roomtypeId}`, requestOptions)
            .then((response) => response.json())
            .then((result) =>  selectedRoomtype = result)
            .then(() => {
                requestOptions = {
                    method: "PUT",
                    headers: {
                        "Authorization": this.parentPage.token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        id: roomtypeId,
                        name: selectedRoomtype.name,
                        description: selectedRoomtype.description,
                        pricePerNigthPerPerson: selectedRoomtype.pricePerNigthPerPerson,
                        capacity: selectedRoomtype.capacity,
                        active: selectedRoomtype.active,
                        images: selectedRoomtype.images,
                        parameters: selectedRoomtype.parameters
                    }),
                    redirect: "follow" as RequestRedirect | undefined
                }
                fetch(`https://hms.jedlik.cloud/api/rooms/types`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => console.log(result))
                    .catch((error) => console.error(error));
            })
    }

    private addEventListeners() {
        [...document.getElementsByClassName("delete")].forEach(button => {
            button.addEventListener("click", () => {
                this.deleteRoomtype(button.id.split("_")[1]);
            });
        });

        [...document.getElementsByClassName("modify")].forEach(button => {
            button.addEventListener("click", () => {
                const roomtypeId = button.id.split("_")[1];
                const roomtypeName = document.querySelector(`#p_${roomtypeId}`);
                const deleteButton = document.getElementById(`delete_${roomtypeId}`);
                if (roomtypeName && deleteButton) {
                    //should open roomtype_admin_page with the selected roomtype
                    roomtypeName.outerHTML = `<input type="text" id="name" value="${roomtypeName.innerHTML}">`;
                    button.outerHTML = "<button type='button' id='confirm_modification'>✅</button>";
                    deleteButton.outerHTML = "<button type='button' id='cancel_modification'>❌</button>";
                    document.querySelector("#confirm_modification")?.addEventListener("click", () => {
                        this.modifyRoomtype(roomtypeId);
                        this.initializeWindow();
                    });
                    document.querySelector("#cancel_modification")?.addEventListener("click", () => {
                        this.initializeWindow();
                    });
                }
            });
        });
    }
}

async function getRoomTypes(parentPage: RoomsAdminPage): Promise<Roomtype[]> {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: { "Authorization": parentPage.token },
        redirect: "follow" as RequestRedirect | undefined
    }
    const response = await fetch("https://hms.jedlik.cloud/api/rooms/types", requestOptions);
    const result = await response.json();

    return result;
}

function fillSelectorContainer(roomtypes: Roomtype[]) {
    const container = document.querySelector("#roomtype_container");
    if (container) {
        container.innerHTML = "";
        roomtypes.forEach((roomtype: Roomtype) => {
            container.innerHTML += `<p id="p_${roomtype.id}" style="display:inline;">${roomtype.name}</p>`;
            container.innerHTML += `<button type="button" id="modify_${roomtype.id}" class="modify">✏️</button>`;
            container.innerHTML += `<button type="button" id="delete_${roomtype.id}" class="delete">🗑️</button><br>`;
        });
        container.innerHTML += `<input type="text" id="name" placeholder="Elnevezés" style="display:none;">`;
        container.innerHTML += `<button type="button" id="confirm" style="display:none;">✅</button>`;
    }


}