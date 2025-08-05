import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Heading,
  Box,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IdataEvent {
  id: string;
  title: string;
  details: string;
  maximumAttendees: string;
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [dataEvent, setDataEvent] = useState<IdataEvent>({
    id: "",
    title: "",
    details: "",
    maximumAttendees: "",
  });

  const { reset } = useForm<IdataEvent>({
    defaultValues: dataEvent,
  });

  // FUNÇÃO DISPARADA PARA CADASTRAR O PARTICIPANTE
  async function onCadEvent(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataEvent),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar participante");
      }

      toast({
        description: "Evento cadastrado com sucesso!",
        position: "top",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      reset();
      setDataEvent({
        id: "",
        title: "",
        details: "",
        maximumAttendees: "",
      });
    } catch (error) {
      toast({
        description: "Erro ao cadastrar evento. Tente novamente.",
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleReset = (event: FormEvent) => {
    event.preventDefault();
    setDataEvent({
      id: "",
      title: "",
      details: "",
      maximumAttendees: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataEvent((prev) => ({
      ...prev,
      [name]: name === "maximumAttendees" ? Number(value) : value,
    }));
  };

  // Determina a cor da borda com base no valor do campo
  const getBorderColor = (value: string) => {
    return value ? "border-green-500" : "border-gray-500";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "xl" }}>
      <ModalOverlay />
      <ModalContent bg="gray.900" mx={4}>
        <ModalHeader className="text-sm sm:text-base">
          {"Cadastrar Evento"}
        </ModalHeader>
        <ModalCloseButton title="Fechar" />

        <ModalBody>
          <Heading size="sm" py={2} className="text-xs sm:text-sm">
            Preencha os dados do evento:
          </Heading>
          <Box
            m={2}
            display="flex"
            flexDirection="column"
            gap={3}
            className="sm:m-4 sm:gap-4"
          >
            <form
              onSubmit={onCadEvent}
              className="flex flex-col gap-4 sm:gap-6"
            >
              <div
                className={`px-2 h-8 sm:h-10 w-full py-1 sm:py-1.5 border rounded-lg flex items-center gap-3 focus-within:border-blue-500 ${getBorderColor(
                  dataEvent.title
                )}`}
              >
                <input
                  className="bg-transparent flex-1 outline-none border-0 text-xs sm:text-sm focus:ring-0 focus:border-blue-500 text-white"
                  placeholder="Título"
                  name="title"
                  value={dataEvent.title}
                  onChange={handleChange}
                  autoComplete="off"
                  maxLength={100}
                  required
                />
              </div>
              <div
                className={`px-2 h-8 sm:h-10 w-full py-1 sm:py-1.5 border rounded-lg flex items-center gap-3 focus-within:border-blue-500 ${getBorderColor(
                  dataEvent.details
                )}`}
              >
                <input
                  className="bg-transparent flex-1 outline-none border-0 text-xs sm:text-sm focus:ring-0 focus:border-blue-500 text-white"
                  placeholder="Detalhes do evento"
                  name="details"
                  value={dataEvent.details}
                  onChange={handleChange}
                  autoComplete="off"
                  maxLength={150}
                  required
                />
              </div>
              <div
                className={`px-2 h-8 sm:h-10 w-full py-1 sm:py-1.5 border rounded-lg flex items-center gap-3 focus-within:border-blue-500 ${getBorderColor(
                  dataEvent.maximumAttendees
                )}`}
              >
                <input
                  type="number"
                  className="bg-transparent flex-1 outline-none border-0 text-xs sm:text-sm focus:ring-0 focus:border-blue-500 text-white"
                  placeholder="Limite de Participantes"
                  name="maximumAttendees"
                  value={dataEvent.maximumAttendees}
                  onChange={handleChange}
                  autoComplete="off"
                  max={100}
                  required
                />
              </div>
              <div className="flex mt-6 sm:mt-10 justify-center sm:justify-end gap-2 sm:gap-4">
                <button
                  className="px-3 sm:px-4 py-2 sm:py-3 w-24 sm:w-36 mb-2 sm:mb-7 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-bold text-xs sm:text-sm"
                  color={"black"}
                  onClick={handleReset}
                >
                  Limpar
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 sm:py-3 w-28 sm:w-40 mb-2 sm:mb-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-xs sm:text-sm"
                >
                  {" "}
                  Cadastrar
                </button>
              </div>
            </form>
            {error && (
              <div className="text-red-500 text-xs sm:text-sm">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-xs sm:text-sm">{success}</div>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
