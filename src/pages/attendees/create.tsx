import { useState, ChangeEvent, FormEvent } from 'react';
import eye from '../../assets/eye.svg';
import eyeSlash from '../../assets/eye-slash.svg';

interface AttendeeData {
    name: string;
    cpf: string;
    email: string;
    senha: string;
}

const eventId = '9ea71ee7-d9e9-444a-ab2e-2df8cd42b652'; // Substitua pelo valor real do eventId

export function CadAttendee() {
    const [attendeeData, setAttendeeData] = useState<AttendeeData>({
        name: '',
        cpf: '',
        email: '',
        senha: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAttendeeData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    async function onCadUser(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const dataToSend = {
            ...attendeeData,
            cpf: attendeeData.cpf, // mantém a remoção de caracteres para garantir limpeza de dados
            eventId: eventId
        };        

        try {
            const response = await fetch('http://localhost:3333/attendees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar participante');
            }

            setSuccess('Participante cadastrado com sucesso!');
            setAttendeeData({
                name: '',
                cpf: '',
                email: '',
                senha: ''
            });
        } catch (error) {
            setError((error as Error).message);
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col w-120 h-120 items-center gap-16 border-gray-600 bg-gray-100 rounded-lg mx-auto mt-20 p-6">
            <h1 className="text-2xl mt-6 text-black font-bold">Cadastrar Participante</h1>
            <form onSubmit={onCadUser} className="flex flex-col gap-6 items-center w-full">
                <div className="px-3 w-full h-10 md:w-96 py-1.5 border border-gray-950 focus-within:border-blue-600 rounded-lg flex items-center">
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-black focus:ring-0"
                        placeholder="Nome completo"
                        name="name"
                        value={attendeeData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="px-3 w-full h-10 md:w-96 py-1.5 border border-gray-950 focus-within:border-blue-600 rounded-lg flex items-center">
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-black focus:ring-0"
                        placeholder="CPF"
                        name="cpf"
                        value={attendeeData.cpf}
                        onChange={handleChange}
                        maxLength={14}
                        required
                    />
                </div>

                <div className="px-3 w-full h-10 md:w-96 py-1.5 border border-gray-950 focus-within:border-blue-600 rounded-lg flex items-center">
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-black focus:ring-0"
                        placeholder="E-mail"
                        name="email"
                        value={attendeeData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="px-3 w-full h-10 md:w-96 py-1.5 border border-gray-950 focus-within:border-blue-600 rounded-lg flex items-center">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm text-black focus:ring-0"
                        placeholder="Senha"
                        name="senha"
                        value={attendeeData.senha}
                        onChange={handleChange}
                        required
                    />
                    {attendeeData.senha && (
                        <img
                            src={showPassword ? eyeSlash : eye}
                            alt="Mostrar/Ocultar"
                            onClick={toggleShowPassword}
                            className="cursor-pointer"
                        />
                    )}
                </div>

                <button type="submit" className="px-4 py-2 w-72 mt-6 mb-10 bg-gradient-to-r from-blue-500 to-gray-600 hover:from-blue-600 hover:to-gray-700 text-white rounded-md transition duration-300 ease-in-out">
                    CADASTRAR
                </button>
            </form>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
        </div>
    );
}
