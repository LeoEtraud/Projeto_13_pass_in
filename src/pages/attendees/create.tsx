import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { formatCpf } from '../../utils/FormatCPF';
import { useToast } from '@chakra-ui/react';
import { useForm } from "react-hook-form";

interface Idata {
    name: string;
    cpf: string;
    email: string;
    senha: string;
    eventId: string;
}

interface IOptions {
    id: string;  // Alterado para usar 'id' ao invés de 'value'
    title: string;  // Alterado para 'title' para refletir o retorno da API
}

export function CadAttendee() {
    const [data, setData] = useState<Idata>({
        name: '',
        cpf: '',
        email: '',
        senha: '',
        eventId: '',
    });

    const { reset } = useForm<Idata>({
        defaultValues: data,
    });

    const toast = useToast();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [eventOptions, setEventOptions] = useState<IOptions[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:3333/events/all');
                if (!response.ok) {
                    throw new Error('Erro ao buscar eventos');
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

    // FUNÇÃO DISPARADA PARA CADASTRAR O PARTICIPANTE 
    async function onCadUser(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:3333/cad-attendees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar participante');
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
                name: '',
                cpf: '',
                email: '',
                senha: '',
                eventId: '',
            });

        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao cadastrar participante. Tente novamente.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="flex flex-col w-96 items-center gap-16 border-2 border-white/10 m-auto mt-10">
            <h1 className="text-2xl mt-6 font-bold">Cadastrar Participante</h1>
            <form onSubmit={onCadUser} className="flex flex-col gap-6 items-center">

                {/* CAMPO DE TEXTO PARA ADICIONAR O NOME COMPLETO */}
                <div className="px-3 w-80 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
                        placeholder="Nome completo"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        autoComplete='off'
                        required
                    />
                </div>

                {/* CAMPO DE TEXTO PARA ADICIONAR O CPF */}
                <div className="px-3 w-80 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
                        placeholder="CPF"
                        name="cpf"
                        value={formatCpf(data.cpf)}
                        onChange={handleChange}
                        maxLength={14}
                        autoComplete='off'
                        required
                    />
                </div>

                {/* CAMPO DE TEXTO PARA ADICIONAR O E-MAIL */}
                <div className="px-3 w-80 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
                        placeholder="E-mail"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete='off'
                        required
                    />
                </div>

                {/* CAMPO DE TEXTO PARA ADICIONAR O SENHA */}
                <div className="px-3 w-80 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
                        placeholder="Senha"
                        name="senha"
                        value={data.senha}
                        onChange={handleChange}
                        autoComplete='off'
                        required
                    />
                </div>

                {/* CAMPO DE SELEÇÃO PARA ESCOLHER O EVENTO */}
                <div className="px-3 w-80 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <select
                        className="bg-transparent flex-1 border-white/10 outline-none border-0 p-0 text-sm focus:ring-0"
                        name="eventId"
                        value={data.eventId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Selecione um evento</option>
                        {eventOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.title}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="px-2 py-1 w-72 mb-6 bg-blue-600 hover:bg-blue-800 text-white rounded-md">
                    CADASTRAR
                </button>

            </form>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
        </div>
    );
}
