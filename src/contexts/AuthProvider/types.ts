
export interface IUser {
    email: string;
    nome_completo: string;
    cpf: string;
    id?: string;
    fone: string;
    matricula: string;
    nome_guerra: string;
    posto_graduacao: string;
    perfil: string;
    aceitou_termos?: boolean
}

export interface IPayLoad {
    msg?: string
    token: string
    user: IUser
}

export interface IContext {
    authenticate: (cpf: string, senha: string) => Promise<void>
}

export interface IAuthProvider {
    children: JSX.Element
}