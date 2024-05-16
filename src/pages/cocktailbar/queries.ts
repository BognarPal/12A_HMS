export class ctQueries{
    token: string = "ZZ3Y5FEAWKAZ4GT3CKNK89ZLMMSNV9XTUK0QS63ZQZDIGB8OELU9A02ZYYZMETFXBXY3ZQKVOT60JUAN0379UJYMPQ04CQMZNCTNEVS7CLZ7YAU1OQUO11VJ";
    baseUrl: string = "https://hms.jedlik.cloud/api/coctailbar/"
    constructor()
    {
        this.getCategories();
    }

    async doLogin(){
        const url = 'https://hms.jedlik.cloud/api/login';
        this.fetch(url, 'POST', {login: "admin", password: "admin"})
            .then( (result) => {
                this.token = JSON.stringify(result);
                console.log(this.token)
            })
            .catch( (error) => {
                console.log(error)
            })
    }

    async getCategories(){
        
        return this.fetch<{
            id: number;
            name: string;
        }[]>(this.baseUrl + "categories", 'GET')
            
    }

    async getCocktails(){
        
        return this.fetch<{
            id: number;
            name: string;
            price: number;
            description: string;
            imageUrls: string[];
            categoryId: number;
            categoryName: string;
        }[]>(this.baseUrl + "coctails", 'GET')
    }

    async addCocktails() {
        
    }


    fetch<T>(url: string, method: string, body: any = null): Promise<T> {
        const userInfo = localStorage.getItem('user');   
        let token = this.token;
       
        const requestOptions: RequestInit = {
            method: method,
            redirect: 'follow',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token

            },
            body: body ? JSON.stringify(body) : null
        };

        return fetch(url, requestOptions)
            .then( (response) => {
                if (response.status == 200) {
                    return response.text();
                } else if (response.status == 500) {                    
                    throw response;
                } else {
                    throw new Error(`Hiba a back-end hívás során (ErrorCode: ${response.status})`)
                }
            })
            .then( (data) => {
                if (data) {
                    return JSON.parse(data) as T
                }
                return null as T;
            })            
    }
}