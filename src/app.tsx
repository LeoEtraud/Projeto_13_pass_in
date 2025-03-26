import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthProvider";

export function App() {
  return (
    <div className="max-w-[1216px] mx-auto py-5 flex flex-col gap-5">
      <BrowserRouter>
        <ChakraProvider>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </ChakraProvider>
      </BrowserRouter>
    </div>
  );
}
