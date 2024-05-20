import { ActiveCard, ChangeActive } from "../activeCard.js";

export class CocktailCard{
   
    html: HTMLElement | null = null;
    name: string = "";
    price: number = 0;
    description: string = "";
    category: string = "";
    img: string = "";
    place: string;
    routes: {[key: string]: {page: any}} = {}

    constructor(name: string, price: number, description: string, category: string, img: string,  place: string, routes: {[key: string]: {page: any}}) {
        
        this.name = name;
        this.price = price;
        this.description = description;
        this.category = category;
        this.img = img;
        this.place = place;

        this.routes = routes;
        
        this.getHtml("src/pages/cocktailbar/components/cocktailCard/cocktailCard.html").then((html)=>{
            const wrapperDiv = document.createElement("div")
            wrapperDiv.innerHTML = html
            const imgH = wrapperDiv.querySelector(".ctCardImg") as HTMLImageElement
            const nameH = wrapperDiv.querySelector(".ctName") as HTMLElement
            const descriptionH = wrapperDiv.querySelector(".ctDescription") as HTMLElement
            const priceH = wrapperDiv.querySelector(".ctABV") as HTMLElement
            
            if(imgH && nameH && descriptionH && priceH){
                nameH.innerText = name;
                descriptionH.innerText = description;
                priceH.innerText = price.toString().slice(0,-3) + 
                (price>=1000 ? "." : "") +
                price.toString().slice(-3)  + 
                "Ft ·";
                imgH.src = img;

            }
            this.html = wrapperDiv.firstElementChild as HTMLElement

            this.html?.addEventListener('click', () => {
                ChangeActive(this)
            })

            const wrap = document.querySelector(place)
            

            wrap?.appendChild(this.html)

            this.createEventListener()
        })
    }
    readdToPlace(){
        if(this.html){
            const wrap = document.querySelector(this.place)
            wrap?.appendChild(this.html)
        }
    }
    
    getHtml(url: string): Promise<string> {
        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow'
        };

        return fetch(url, requestOptions)
            .then( (response) => {
                return response.text()
            })
            .catch( (error) => {
                throw new Error(error);
            })
    }

    createEventListener() {
        const navLinks = document.querySelectorAll('a[data-route="cocktailmodal"]');
        navLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const route = link.getAttribute('data-route');
                if ( route != null && this.routes[route] && this.routes[route].page) {
                    new this.routes[route].page();
                }
            });
        });
    }
    
}