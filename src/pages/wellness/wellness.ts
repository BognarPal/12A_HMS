import { Page } from "../page.js";
import { UserData } from "./user.js";
import { WellnessProduct } from "./wellnessproduct.js";

export class WellnessPage extends Page {
  constructor() {
    super('/src/pages/wellness/wellness.html')
    this.getHtmlCallback();
  }

  login() {
    var sucLogin : boolean = false;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const body = JSON.stringify({
      "loginName": (document.getElementById("user") as HTMLInputElement).value.toString(),
      "password": (document.getElementById("pass") as HTMLInputElement).value.toString()
    });

     this.fetch<UserData>("https://hms.jedlik.cloud/api/login", "POST", body)
      .then((result) => {
        localStorage.setItem("user", JSON.stringify(result));
        localStorage.setItem("roles", JSON.stringify(result.roles));
        sucLogin = true;
        this.LoginVisual();
      })
      .catch((error) => {
        console.error(error);
        sucLogin = false;
      });
        (document.getElementById("pass") as HTMLInputElement).value = '';
        (document.getElementById("user") as HTMLInputElement).value = ''; 

        
      

    }

  override getHtmlCallback() {
    this.getProductsData();
  }
  addToCart(){
    console.log("asd");
  }
  addToCartBtnListener(){
    var cartbtn : NodeListOf<HTMLElement> = document.querySelectorAll("p.cartbtn")!;
    var i : number = 0;
    cartbtn.forEach((e)=>{
        e.addEventListener("click", ()=>{
          this.addToCart();
        });
    });
  }

  addButtonEventListeners() {
    document.getElementById("btnconfirm")?.addEventListener("click", () => {
      this.login();
    });
    this.addToCartBtnListener();
  }
  getProductsData() {
    this.fetch<WellnessProduct[]>("https://hms.jedlik.cloud/api/publicpages/wellnessproducts", "GET")
      .then((result) => {
        var maindiv = document.getElementById("maindiv") as HTMLElement;
        // var contentCollection : HTMLCollection = maindiv.children;
        maindiv.innerHTML = "";
        var i: number = 0;
        result.forEach(element => {
          i++;
          if (i % 2 == 0) {
            maindiv.innerHTML += `
            <div class="w-full self-end max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <img class="p-8 rounded-t-lg" src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="product image" />
            </a>
            <div class="px-5 pb-5">
                <a href="#">
                    <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">${element.name}</h5>
                </a>
                <div class="flex items-center mt-2.5 mb-5 text-gray-900 dark:text-white">
                ${element.description}
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-3xl font-bold text-gray-900 dark:text-white">${element.price} Ft</span>
                    <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Kosárba</a>
                </div>
            </div>
        </div>`;
              console.log("button appended.");
          }
          else{
              maindiv.innerHTML += `
              <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                  <img class="p-8 rounded-t-lg" src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="product image" />
              </a>
              <div class="px-5 pb-5">
                  <a href="#">
                      <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">${element.name}</h5>
                  </a>
                  <div class="flex items-center mt-2.5 mb-5 text-gray-900 dark:text-white">
                  ${element.description}
                  </div>
                  <div class="flex items-center justify-between">
                      <span class="text-3xl font-bold text-gray-900 dark:text-white">${element.price} Ft</span>
                      <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Kosárba</a>
                  </div>
              </div>
          </div>`;
                console.log("button appended.");
          }
        });
        this.addButtonEventListeners();
      })
      .catch((error) => console.error(error));
      
  }
  addAdminButtonListener(){
    var adminbutton : HTMLElement = document.getElementById("AdminButton")!; 
    adminbutton.addEventListener("click", ()=>{
      var url : string[] = window.location.href.split("?");
      window.history.replaceState(null, "", `${url[0]}?page=servicesadmin`);
      location.reload();
    });
  }
  LoginVisual() {
    var form = document.getElementById("form") as HTMLElement;
    form.innerHTML = "";
    var innerheader = document.querySelector("#profilepicdiv") as HTMLElement;
    innerheader.innerHTML += `<img id="profilepic" src="" alt="Profile Picture" >`;

    if (localStorage.getItem("roles")?.includes("admin")) {
      var maincontainer : HTMLElement = document.querySelector("#AdmDiv")!;
      maincontainer.innerHTML += `<a id="AdminButton" class="hover:text-darkGrayishBlue font-bold" data-route="servicesadmin">Átlépés Admin Nézetbe</a>`;
      this.addAdminButtonListener();
    }
  }


}