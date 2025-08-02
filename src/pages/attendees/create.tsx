import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  formatCpf,
  formatDate,
  formatPhone,
} from "../../utils/Format-Cpf-Phone";
import { useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import eye from "../../assets/eye.svg";
import eyeSlash from "../../assets/eye-slash.svg";

interface Idata {
  id: string;
  name: string;
  sexo: string;
  data_nasc: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  confirm_senha: string;
  eventId: string;
}

interface IOptions {
  id: string; // Alterado para usar 'id' ao invés de 'value'
  title: string; // Alterado para 'title' para refletir o retorno da API
}

export function CadAttendee() {
  const [data, setData] = useState<Idata>({
    id: "",
    name: "",
    sexo: "",
    data_nasc: "",
    cpf: "",
    email: "",
    telefone: "",
    senha: "",
    confirm_senha: "",
    eventId: "",
  });

  const { reset } = useForm<Idata>({
    defaultValues: data,
  });

  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [eventOptions, setEventOptions] = useState<IOptions[]>([]);

  // Estado para controle de exibição da senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}/events/all`);
        if (!response.ok) {
          throw new Error("Erro ao buscar eventos");
        }
        const data = await response.json();
        setEventOptions(data.events); // Recebe diretamente os eventos do backend
      } catch (error) {
        console.error(error);
        toast({
          title: "Erro",
          description: "Erro ao buscar eventos. Tente novamente.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchEvents();
  }, [toast]);

  const validateCPF = async () => {
    try {
      // Verificar se 'data' está definido e possui 'cpf'
      if (!data || !data.cpf) {
        toast({
          position: "top",
          description: "Dados inválidos para validação.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API}/attendees/validator_cpf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: data.cpf }),
        }
      );

      // Verificar o status da resposta antes de tentar convertê-la para JSON
      if (!response.ok) {
        toast({
          position: "top",
          description:
            "Erro ao verificar CPF existente. Tente novamente mais tarde.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      }

      if (response.status === 204) {
        return true;
      }
      const validator = await response.json();
      if (validator.cpf) {
        toast({
          position: "top",
          description: "CPF já existente",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
      return true;
    } catch (error) {
      // Em caso de erro, exibe uma mensagem e retorna false
      toast({
        position: "top",
        description: "Erro ao verificar CPF existente",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  // FUNÇÃO DISPARADA PARA CADASTRAR O PARTICIPANTE
  async function onCadUser(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const cpfIsValid = await validateCPF();
    if (!cpfIsValid) {
      // Se o CPF já existir, interrompe o cadastro
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/cad-attendees/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cadastrar participante");
      }

      toast({
        title: "Sucesso",
        description: "Participante cadastrado com sucesso!",
        position: "top",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      reset(); // Limpa os campos após o sucesso
      setData({
        id: "",
        name: "",
        sexo: "",
        data_nasc: "",
        cpf: "",
        email: "",
        telefone: "",
        senha: "",
        confirm_senha: "",
        eventId: "",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar participante. Tente novamente.",
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (e: any) => {
    const formattedDate = formatDate(e.target.value);
    setData({
      ...data,
      data_nasc: formattedDate,
    });
  };

  // FUNÇÃO PARA EXIBIR/OCULTAR SENHA
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // FUNÇÃO PARA EXIBIR/OCULTAR CONFIRMAR SENHA
  const toggleConfirmShowPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Determina a cor da borda com base no valor do campo
  const getBorderColor = (value: string) => {
    return value ? "border-green-500" : "border-gray-500";
  };

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex gap-3 items-center my-10">
        <h1 className="text-2xl font-bold">Inscrição de Participante</h1>
      </div>

      {/* Aplicando a borda azul ao redor do formulário */}
      <div className="border border-white/10 rounded-lg">
        <form
          onSubmit={onCadUser}
          className="grid grid-cols-1 md:grid-cols-2 m-10 gap-6"
        >
          {/* CAMPO DE TEXTO PARA ADICIONAR O NOME COMPLETO */}
          <div
            className={`px-3 w-full py-1.5 border focus-within:border-blue-500  rounded-lg flex items-center gap-3 ${getBorderColor(
              data.name
            )}`}
          >
            <input
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 focus:outline-none focus:placeholder-transparent"
              placeholder="Nome completo"
              name="name"
              value={data.name}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* CAMPO DE TEXTO PARA ADICIONAR O GÊNERO */}
          <div
            className={`px-3 w-full py-1.5 border focus-within:border-blue-500  rounded-lg flex items-center gap-3 ${getBorderColor(
              data.sexo
            )}`}
          >
            <select
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 focus:outline-none focus:placeholder-transparent"
              name="sexo"
              value={data.sexo}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Sexo
              </option>
              <option
                value="Masculino"
                className="text-black hover:bg-gray-200"
              >
                Masculino
              </option>
              <option value="Feminino" className="text-black hover:bg-gray-200">
                Feminino
              </option>
            </select>
          </div>

          {/* CAMPO DE TEXTO PARA ADICIONAR A DATA DE NASCIMENTO */}
          <div
            className={`px-3 w-full py-1.5 border focus-within:border-blue-500  rounded-lg flex items-center gap-3 ${getBorderColor(
              data.data_nasc
            )}`}
          >
            <input
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 focus:outline-none focus:placeholder-transparent"
              type="text"
              placeholder="Data de Nascimento"
              name="data_nasc"
              value={formatDate(data.data_nasc)}
              onChange={(e) => handleDateChange(e)}
              maxLength={10}
              autoComplete="off"
              required
            />
          </div>

          {/* CAMPO DE TEXTO PARA ADICIONAR O CPF */}
          <div
            className={`px-3 w-full py-1.5 border focus-within:border-blue-500  rounded-lg flex items-center gap-3 ${getBorderColor(
              data.cpf
            )}`}
          >
            <input
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 focus:outline-none focus:placeholder-transparent"
              placeholder="CPF"
              name="cpf"
              value={formatCpf(data.cpf)}
              onChange={handleChange}
              maxLength={14}
              autoComplete="off"
              required
            />
          </div>

          {/* CAMPO DE TEXTO PARA ADICIONAR O E-MAIL */}
          <div
            className={`px-3 w-full py-1.5 border focus-within:border-blue-500  rounded-lg flex items-center gap-3 ${getBorderColor(
              data.email
            )}`}
          >
            <input
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 focus:outline-none focus:placeholder-transparent"
              placeholder="E-mail"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* CAMPO DE TEXTO PARA ADICIONAR O Nº WHATSAPP */}
          <div
            className={`px-3 w-full py-1.5 border focus-within:border-blue-500  rounded-lg flex items-center gap-3 ${getBorderColor(
              data.telefone
            )}`}
          >
            <input
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 focus:outline-none focus:placeholder-transparent"
              placeholder="Telefone/WhatsApp"
              name="telefone"
              value={formatPhone(data.telefone)}
              maxLength={14}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* CAMPO DE TEXTO PARA ADICIONAR A SENHA */}
          <div
            className={`px-3 w-full py-1.5 border focus-within:border-blue-500  rounded-lg flex items-center gap-3 ${getBorderColor(
              data.senha
            )}`}
          >
            <input
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 focus:outline-none focus:placeholder-transparent"
              placeholder="Senha"
              name="senha"
              type={showPassword ? "text" : "password"} // Alterna o tipo de input
              value={data.senha}
              onChange={handleChange}
              autoComplete="off"
              required
            />
            {data.senha && (
              <img
                src={showPassword ? eyeSlash : eye}
                alt="Mostrar/Ocultar"
                onClick={toggleShowPassword}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>

          {/* CAMPO DE TEXTO PARA CONFIRMAR A SENHA */}
          <div
            className={`px-3 w-full py-1.5 border focus-within:border-blue-500  rounded-lg flex items-center gap-3 ${getBorderColor(
              data.confirm_senha
            )}`}
          >
            <input
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 focus:outline-none focus:placeholder-transparent"
              placeholder="Confirmar Senha"
              name="confirm_senha"
              type={showConfirmPassword ? "text" : "password"} // Alterna o tipo de input
              value={data.confirm_senha}
              onChange={handleChange}
              autoComplete="off"
              required
            />
            {data.confirm_senha && (
              <img
                src={showConfirmPassword ? eyeSlash : eye}
                alt="Mostrar/Ocultar"
                onClick={toggleConfirmShowPassword}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>

          {/* CAMPO DE SELEÇÃO PARA ESCOLHER O EVENTO */}
          <div
            className={`px-3 w-full py-1.5 border focus-within:border-blue-500  rounded-lg flex items-center gap-3 justify-center md:col-span-2 ${getBorderColor(
              data.eventId
            )}`}
          >
            <select
              className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 focus:outline-none focus:placeholder-transparent"
              name="eventId"
              value={data.eventId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Selecione um evento
              </option>
              {eventOptions.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                  className="text-black hover:bg-gray-200"
                >
                  {option.title}
                </option>
              ))}
            </select>
          </div>

          {/* Botão de Submissão */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-10">
            <button
              type="submit"
              className="px-2 py-2 w-52 mb-2 font-bold bg-blue-600 hover:bg-blue-800 text-white rounded-md"
            >
              ME INSCREVER
            </button>
          </div>
        </form>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
    </div>
  );
}
