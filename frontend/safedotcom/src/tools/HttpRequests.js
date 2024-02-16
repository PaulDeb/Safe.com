import { URL_API } from "./constants";

export async function HttpGetRequest(route) {
    try {
        let headers = new Headers ({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });

        const response = await fetch(URL_API + route, {
            method: "GET",
            headers,
            // mode: 'no-cors',
        });
        return(response);
    } catch (error) {
        console.log(error);
    }
}

export async function HttpPostRequest(route, body) {
    try {
        let headers = new Headers ({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });

        const response = await fetch(URL_API + route, {
            method: "POST",
            headers,
            // mode: 'no-cors',
            body: JSON.stringify(body)
        });
        return(response);
    } catch (error) {
        console.log(error);
        console.log(error.message);
    }
}

export async function HttpPatchRequest(route, body) {
    try {
        let headers = new Headers ({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });

        const response = await fetch(URL_API + route, {
            method: "PATCH",
            headers,
            // mode: 'no-cors',
            body: JSON.stringify(body)
        });
        return(response);
    } catch (error) {
        console.log(error);
    }
}

export async function HttpPutRequest(route, body) {
    try {
        let headers = new Headers ({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });

        const response = await fetch(URL_API + route, {
            method: "PUT",
            headers,
            // mode: 'no-cors',
            body: JSON.stringify(body)
        });
        return(response);
    } catch (error) {
        console.log(error);
    }
}

export async function HttpDeleteRequest(route, body) {
    try {
        let headers = new Headers ({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });

        const response = await fetch(URL_API + route, {
            method: "DELETE",
            headers,
            // mode: 'no-cors',
            body: JSON.stringify(body)
        });
        return(response);
    } catch (error) {
        console.log(error);
    }
}