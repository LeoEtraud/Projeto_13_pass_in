import { useState, ChangeEvent, FormEvent } from 'react';

export function CadAttendee() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // FUNÇÃO DISPARADA PARA CADASTRAR O PARTICIPANTE 
    async function onCadUser(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const attendeeData = {
            name: name,
            email: email
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
            setName('');
            setEmail('');
        } catch (error) {
            setError('Erro ao cadastrar participante');
        }
    }

    return (
        <div className="flex flex-col w-96 items-center gap-16 border-2 border-white/10 m-auto mt-10">
            <h1 className="text-2xl mt-6 font-bold">Cadastrar Participante</h1>
            <form onSubmit={onCadUser} className="flex flex-col gap-6 items-center">

                {/* CAMPO DE TEXTO PARA ADICIONAR O NOME COMPLETO*/}
                <div className="px-3 w-80 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
                        placeholder="Nome completo"
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* CAMPO DE TEXTO PARA ADICIONAR O E-MAIL*/}
                <div className="px-3 w-80 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                    />
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
