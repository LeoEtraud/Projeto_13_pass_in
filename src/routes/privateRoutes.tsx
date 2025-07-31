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
  }, []);

  const location = useLocation(); // Obtém a localização atual

  if (loading) {
    // Pode exibir um loader ou uma mensagem de carregamento aqui
    return null;
  }

  // Verifica qualquer token "falsy" (null, undefined, '', etc.)
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
