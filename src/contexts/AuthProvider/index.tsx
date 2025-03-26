import { createContext, useState } from "react";
import { api } from "../../services/api";
import { useToast } from "@chakra-ui/react";
import { IAuthProvider, IContext } from "./types";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem("@Auth:userId") || null
      : null
  );
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem("@Auth:token") || null
      : null
  );

  const toast = useToast();
  const navigate = useNavigate(); // Hook de navegação

  // Carrega dados do usuário armazenados localmente
  const checkAuth = async () => {
    const storageUser = localStorage.getItem("@Auth:userId");
    const storageToken = localStorage.getItem("@Auth:token");

    if (storageUser && storageToken) {
      setUser(storageUser);
      setToken(storageToken);
    }
  };

  // Função para realizar o login do sistema
  const signIn = async (cpf: string, senha: string) => {
    try {
      const response = await api.post("/auth", {
        cpf,
        senha,
      });

      if (response.data.error) {
        toast({
          title: "Erro",
          description: "Erro ao tentar se logar. Tente novamente.",
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setUser(response.data.userId);
        setToken(response.data.token);
        api.defaults.headers.common[
          "authorization"
        ] = `Bearer ${response.data.token}`;
        localStorage.setItem(
          "@Auth:userId",
          JSON.stringify(response.data.userId)
        );
        localStorage.setItem("@Auth:token", response.data.token);

        setTimeout(() => {
          toast({
            description: "Autenticação realizada com sucesso!",
            position: "top",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          navigate("/cad-attendees"); // Redireciona para a próxima página
        }, 750);
      }
    } catch (error) {
      console.error("Erro ao realizar o login:", error);
      toast({
        title: "Erro",
        description: "Erro ao tentar se logar. Tente novamente.",
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Função para realizar o logout do sistema
  const signOut = () => {
    toast({
      position: "top",
      description: "Sua sessão foi encerrada.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    setUser(null);
    setToken(null);
    localStorage.removeItem("@Auth:userId");
    localStorage.removeItem("@Auth:token");

    // Redireciona o usuário para a página de login
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        checkAuth,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
