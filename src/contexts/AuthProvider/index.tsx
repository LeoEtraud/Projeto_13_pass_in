import { createContext } from "react";
import { IAuthProvider, IContext } from "./types";
import { LoginRequest, setUserLocalStorage } from "./util";

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: IAuthProvider) => {

async function authenticate(cpf: string, senha: string) {
    const response = await LoginRequest(cpf, senha)
    .then((response => {
      return response
    }))
    .catch(error => {
      return Promise.reject(error)
    })
    
    setUserLocalStorage(response)
  }

  return (
    <AuthContext.Provider value={{ 
      authenticate,
    }}>
      {children}
    </AuthContext.Provider>
  )
}