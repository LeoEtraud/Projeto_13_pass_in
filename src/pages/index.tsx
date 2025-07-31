import { useState, ChangeEvent } from "react";
import eye from "../assets/eye.svg";
import eyeSlash from "../assets/eye-slash.svg";
import { formatCpf } from "../utils/Format-Cpf-Phone";

import { CircularProgress, useToast } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthProvider/useAuth";
import gestorIcon from "/icone.png"; // ou png

export function Login() {
  const [cpf, setCpf] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Define o carregamento como verdadeiro

    try {
      signIn(cpf, senha);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Erro na autenticação. Tente novamente.";
      toast({
        title: "Erro",
        description: errorMessage,
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Define o carregamento como falso após o processamento
    }
  };

  // FUNÇÃO PARA EXIBIR/OCULTAR SENHA
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Determina a cor da borda com base no valor do campo
  const getBorderColor = (value: string) => {
    return value ? "border-green-500" : "border-gray-500";
  };

  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center
        bg-cover bg-center p-4
      "
      style={{
        backgroundImage: "url('/event.jpg')", // ajuste para o caminho correto da imagem
      }}
    >
      <div className="flex flex-col w-full max-w-md md:w-1/2 lg:w-1/3 h-auto xl:w-1/2 min-h-[500px] items-center gap-0 border-2 bg-zinc-900 border-white/5 rounded-lg m-auto p-4 md:p-5 shadow-[0_0_50px_rgba(45,96,235,0.2)]">
        <img
          src={gestorIcon}
          alt="Gestor"
          className="h-24 md:h-36"
          draggable={false}
        />
        <h1 className="text-lg md:text-xl font-bold text-white text-center">
          LOGIN DO GESTOR
        </h1>
        <form
          onSubmit={handleSignIn}
          className="flex flex-col gap-4 md:gap-6 items-center w-full"
        >
          {/* CAMPO DE TEXTO PARA ADICIONAR O CPF */}
          <div
            className={`px-3 h-10 w-64 md:w-72 py-1.5 border-4 mt-6 md:mt-10 bg-white rounded-lg flex items-center gap-3 focus-within:border-blue-500 ${getBorderColor(
              cpf
            )}`}
          >
            <input
              inputMode="numeric"
              className="bg-transparent flex-1 outline-none border-0 readonly:bg-gray-100 readonly:text-gray-500 p-0 text-sm focus:ring-0 focus:border-blue-500 text-black"
              placeholder="CPF"
              value={cpf}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCpf(formatCpf(e.target.value))
              }
              maxLength={14}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              required
            />
          </div>

          {/* CAMPO DE TEXTO PARA ADICIONAR A SENHA */}
          <div
            className={`px-3 h-10 w-64 md:w-72 py-2 mb-0 border-4 bg-white rounded-lg flex items-center focus-within:border-blue-500 ${getBorderColor(
              senha
            )}`}
          >
            <input
              type={showPassword ? "text" : "password"}
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0 focus:border-blue-500 text-black"
              placeholder="Senha"
              value={senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSenha(e.target.value)
              }
              required
            />

            {senha && (
              <img
                src={showPassword ? eyeSlash : eye}
                alt="Mostrar/Ocultar"
                onClick={toggleShowPassword}
                style={{ cursor: "pointer" }}
                width={25}
              />
            )}
          </div>

          <button
            type="submit"
            className="my-3 md:my-5 px-2 py-1 w-48 max-w-[200px] md:w-44 h-8 md:h-10 mb-4 md:mb-6 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded-md text-sm md:text-base"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress isIndeterminate size="20px" />
            ) : (
              "ACESSAR"
            )}
          </button>

          <div className="flex items-center my-3 md:my-5 w-full justify-center">
            <span className="text-gray-500 text-xs md:text-sm">
              _____________
            </span>
            <span className="mx-3 md:mx-5 text-gray-600 text-xs md:text-sm">
              ou
            </span>
            <span className="text-gray-500 text-xs md:text-sm">
              _____________
            </span>
          </div>

          <div className="flex items-center justify-center mb-2 w-full">
            <a
              className="text-yellow-300 font-thin hover:text-yellow-400 text-center text-sm md:text-base"
              href="/cad-attendees"
            >
              INSCREVA-SE EM UM EVENTO
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
