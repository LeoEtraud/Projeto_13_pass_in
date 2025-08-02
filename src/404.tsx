import { Image, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import animation from "../src/assets/animation.gif";

export function NotFound() {
  return (
    <VStack
      spacing={4}
      align="center"
      justify="center"
      minH="80vh" // Ocupa a altura total da viewport
      textAlign="center"
      userSelect={"none"} // Desabilita a seleção de texto
    >
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "400px" }} // Aumentado para 400px em telas maiores
        src={animation}
        alt="Animação de página não encontrada"
      />

      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Not Found
      </Text>
      <Text>
        Voltar para{" "}
        <Link to="/attendees" style={{ color: "blue" }}>
          Dashboard
        </Link>
      </Text>
    </VStack>
  );
}
