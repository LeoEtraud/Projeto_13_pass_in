import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider/useAuth";

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth(); // Assumindo que checkAuth é uma função assíncrona que verifica a autenticação
      setLoading(false);
    };

    checkAuthentication();
  }, [checkAuth]);

  const location = useLocation(); // Obtém a localização atual

  if (loading) {
    // Pode exibir um loader ou uma mensagem de carregamento aqui
    return null;
  }

  // Se não estiver logado, redireciona para a página de login e mantém a rota de destino
  return token !== "null" ? (
    <>{children}</>
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};
