import { useState, ChangeEvent } from "react";
import eye from "../assets/eye.svg";
import eyeSlash from "../assets/eye-slash.svg";
import { formatCpf } from "../utils/Format-Cpf-Phone";

import { CircularProgress, useToast } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthProvider/useAuth";

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
      await signIn(cpf, senha);
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
    <div className="flex flex-col w-6/12 items-center gap-16 border-2 bg-gray-900 border-white/10 rounded-lg m-auto mt-36 p-6">
      <h1 className="text-2xl mt-6 font-bold text-white">LOGIN</h1>
      <form
        onSubmit={handleSignIn}
        className="flex flex-col gap-6 items-center"
      >
        {/* CAMPO DE TEXTO PARA ADICIONAR O CPF */}
        <div
          className={`px-3 h-10 w-72 py-1.5 border-4 bg-white rounded-lg flex items-center gap-3 focus-within:border-blue-500 ${getBorderColor(
            cpf
          )}`}
        >
          <input
            className="bg-transparent flex-1 outline-none border-0 readonly:bg-gray-100 readonly:text-gray-500 p-0 text-sm focus:ring-0 focus:border-blue-500 text-black"
            placeholder="CPF"
            value={cpf}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCpf(formatCpf(e.target.value))
            }
            maxLength={14}
            required
          />
        </div>

        {/* CAMPO DE TEXTO PARA ADICIONAR A SENHA */}
        <div
          className={`px-3 h-10 w-72 py-1.5 mb-0 border-4 bg-white rounded-lg flex items-center focus-within:border-blue-500 ${getBorderColor(
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
        <h1 className="text-right w-80 mt-0 text-sm text-gray-300">
          esqueceu a senha?
        </h1>

        <button
          type="submit"
          className="px-2 py-1 w-52 h-10 mb-6 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded-md"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress isIndeterminate size="20px" />
          ) : (
            "ACESSAR"
          )}
        </button>
      </form>
    </div>
  );
}
