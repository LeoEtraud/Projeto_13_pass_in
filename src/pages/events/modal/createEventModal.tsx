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
      const response = await fetch("http://localhost:3333/events", {
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
        title: "Sucesso",
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
        title: "Erro",
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.900">
        <ModalHeader>{"Cadastrar Evento"}</ModalHeader>
        <ModalCloseButton
          title="Fechar"
          _hover={{ border: "1px solid lightblue" }}
        />

        <ModalBody>
          <Heading size="sm" pb={1}>
            Preencha os dados do evento:
          </Heading>
          <Box m={4} display="flex" flexDirection="column" gap={4}>
            <form onSubmit={onCadEvent} className="flex flex-col gap-4">
              <div className="px-3 h-10 w-full py-1.5 border rounded-lg flex items-center gap-3 focus-within:border-blue-500">
                <input
                  className="bg-transparent flex-1 outline-none border-0 text-sm focus:ring-0 focus:border-blue-500 text-white"
                  placeholder="Título"
                  name="title"
                  value={dataEvent.title}
                  onChange={handleChange}
                  autoComplete="off"
                  maxLength={100}
                  required
                />
              </div>
              <div className="px-3 h-10 w-full py-1.5 border rounded-lg flex items-center gap-3 focus-within:border-blue-500">
                <input
                  className="bg-transparent flex-1 outline-none border-0 text-sm focus:ring-0 focus:border-blue-500 text-white"
                  placeholder="Detalhes do evento"
                  name="details"
                  value={dataEvent.details}
                  onChange={handleChange}
                  autoComplete="off"
                  maxLength={150}
                  required
                />
              </div>
              <div className="px-3 h-10 w-full py-1.5 border rounded-lg flex items-center gap-3 focus-within:border-blue-500">
                <input
                  type="number"
                  className="bg-transparent flex-1 outline-none border-0 text-sm focus:ring-0 focus:border-blue-500 text-white"
                  placeholder="Limite de Participantes"
                  name="maximumAttendees"
                  value={dataEvent.maximumAttendees}
                  onChange={handleChange}
                  autoComplete="off"
                  max={100}
                  required
                />
              </div>
              <div className="flex mt-10 justify-end gap-4 ">
                <button
                  className="px-2 py-1 w-40 mb-6 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-bold"
                  color={"black"}
                  onClick={handleReset}
                >
                  Limpar
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 w-48 mb-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold"
                >
                  {" "}
                  Cadastrar
                </button>
              </div>
            </form>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
