import Cookies from "js-cookie"
import { apiPassIn } from "../../services/apiServer"
import { IPayLoad } from "./types"
import { AxiosRequestConfig } from "axios"

export function setUserLocalStorage(user: IPayLoad | null) {

    localStorage.setItem('u', JSON.stringify(user))
    Cookies.set('corujaId', JSON.stringify(user), {
        expires: 30 / 1440
    })
    if (user && user.token) {
        Cookies.set('corujaToken', user.token, {
            expires: 30 / 1440
        })
    }
}

export function HearderAuthenticated() {
    // Configuração do header
    const token = Cookies.get("corujaId")
    const y = JSON.parse(String(token))

    const config: AxiosRequestConfig = {
        headers: {
            "Authorization": `Bearer ${y.token}`
        }
    }
    return config
}

export async function LoginRequest(cpf: string, senha: string) {
    try {
        const request = await apiPassIn.post("auth", { cpf, senha })
        return request.data
    } catch (error) {
        return Promise.reject(error)
    }

}

