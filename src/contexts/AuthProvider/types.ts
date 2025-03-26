export interface IContext {
  signIn: (cpf: string, senha: string) => void;
  signOut: () => void;
  token: string | null;
  checkAuth: () => Promise<void>;
  user: string | null;
}

export interface IAuthProvider {
  children: JSX.Element;
}
