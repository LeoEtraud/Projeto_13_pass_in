import { useState, ChangeEvent, FormEvent } from 'react';
import eye from '../assets/eye.svg';
import eyeSlash from '../assets/eye-slash.svg';
import { formatCpf } from '../utils/FormatCPF';

export function Login() {
    const [cpf, setCpf] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // FUNÇÃO DISPARADA PARA CADASTRAR O PARTICIPANTE 
    async function onCadUser(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const attendeeData = {
            cpf: cpf.replace(/\D/g, ''), // remove caracteres não numéricos
            senha: senha,
        };

        try {
            const response = await fetch('http://localhost:3333/attendees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(attendeeData)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar participante');
            }

            setSuccess('Participante cadastrado com sucesso!');
            setCpf('');
            setSenha('');
        } catch (error) {
            setError('Erro ao cadastrar participante');
        }
    }

   

    // FUNÇÃO PARA EXIBIR/OCULTAR SENHA
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    // Determina a cor da borda com base no valor do campo
    const getBorderColor = (value: string) => {
        return value ? 'border-green-500' : 'border-gray-500';
    };

    return (
        <div className="flex flex-col w-96 items-center gap-16 border-2 border-white/10 rounded-lg m-auto mt-36 p-6">
            <h1 className="text-2xl mt-6 font-bold text-white">LOGIN</h1>
            <form onSubmit={onCadUser} className="flex flex-col gap-6 items-center">

                {/* CAMPO DE TEXTO PARA ADICIONAR O CPF */}
                <div className={`px-3 h-10 w-80 py-1.5 border rounded-lg flex items-center gap-3 focus-within:border-blue-500 ${getBorderColor(cpf)}`}>
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0 focus:border-blue-500 text-white"
                        placeholder="CPF"
                        value={cpf}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCpf(formatCpf(e.target.value))}
                        maxLength={14}
                        required
                    />
                </div>

                {/* CAMPO DE TEXTO PARA ADICIONAR A SENHA */}
                <div className={`px-3 h-10 w-80 py-1.5 mb-0 border rounded-lg flex items-center focus-within:border-blue-500 ${getBorderColor(senha)}`}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0 focus:border-blue-500 text-white"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                        required
                    />

                    {senha && (
                        <img
                            src={showPassword ? eyeSlash : eye}
                            alt="Mostrar/Ocultar"
                            onClick={toggleShowPassword}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                </div>
                <h1 className="text-right w-80 mt-0 text-sm text-gray-300">esqueceu a senha?</h1>

                <button type="submit" className="px-2 py-1 w-72 mb-6 bg-blue-600 hover:bg-blue-800 text-white rounded-md">
                    ACESSAR
                </button>

            </form>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
        </div>
    );
}
