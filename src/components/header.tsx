import nlwUniteIcon from "../assets/nlw-unite-icon.svg";
import { NavLink } from "react-router-dom"; // Adicionamos o useNavigate
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { CircularProgress } from "@chakra-ui/react";

export function Header() {
  const { signOut } = useContext(AuthContext); // Acesso ao contexto para fazer o logout
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Função para lidar com o logout
  const handleLogout = async () => {
    setLoading(true); // Ativa o estado de carregamento
    await signOut(); // Chama a função de logout do AuthContext
    setLoading(false); // Desativa o estado de carregamento após o logout
  };

  return (
    <div className="flex items-center gap-5 py-2">
      <img src={nlwUniteIcon} alt="Logo" />

      <nav className="flex items-center gap-5">
        {/* Usando NavLink para gerenciar o estado ativo */}
        <NavLink
          to="/cad-attendees"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-blue-600"
              : "hover:border-b-2 hover:border-blue-400"
          }
        >
          Cadastrar
        </NavLink>
        <NavLink
          to="/events"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-blue-600"
              : "hover:border-b-2 hover:border-blue-400"
          }
        >
          Eventos
        </NavLink>
        <NavLink
          to="/attendees"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-blue-600"
              : "hover:border-b-2 hover:border-blue-400"
          }
        >
          Participantes
        </NavLink>
      </nav>

      {/* Botão de Logout */}
      <button
        title="Logout"
        onClick={handleLogout}
        disabled={loading} // Desabilita o botão enquanto carrega
        className="ml-auto px-2 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-800 transition"
      >
        {loading ? (
          <CircularProgress aria-label="Loading..." color="primary" />
        ) : (
          "Sair"
        )}
      </button>
    </div>
  );
}
