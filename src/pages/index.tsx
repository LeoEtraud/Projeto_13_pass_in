import { useState, useEffect } from 'react';
import { useToast } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthProvider/useAuth";
import eye from '../assets/eye.svg';
import eyeSlash from '../assets/eye-slash.svg';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

type LoginInFormData = {
    cpf: string;
    senha: string;
}

interface ErroType {
    response?: {
        data: {
            message: string
        }
    }
}

export function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const auth = useAuth();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initValues = {
        cpf: "",
        senha: "",
    };

    const schema = yup.object().shape({
        cpf: yup.string().required('CPF obrigatório').length(11, 'CPF deve ter 11 dígitos'),
        senha: yup.string().required('Senha obrigatória'),
    });

    useEffect(() => {
        const token = Cookies.get("corujaId");
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginInFormData>({
        mode: "onTouched",
        reValidateMode: "onSubmit",
        resolver: yupResolver(schema),
        defaultValues: initValues,
    });

    const onCadUser: SubmitHandler<LoginInFormData> = async (values) => {
        setIsSubmitting(true);
        try {
            await auth.authenticate(values.cpf, values.senha);
            toast({
                position: 'top',
                description: "Autenticado com sucesso!",
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            setTimeout(() => navigate("/dashboard"), 500);
        } catch (err) {
            const error = err as ErroType;
            if (error.response) {
                toast({
                    position: 'top',
                    description: error.response.data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const getBorderColor = (value: string | undefined) => {
        return value ? 'border-green-500' : 'border-gray-300';
    };

    return (
        <div className="flex flex-col w-120 h-120 items-center gap-16 border-gray-600 bg-gray-100 rounded-lg mx-auto mt-20 p-6">
            <h1 className="text-2xl mt-6 font-bold text-gray-900">LOGIN</h1>
            <form onSubmit={handleSubmit(onCadUser)} className="flex flex-col gap-6 items-center w-full">

                <div className={`px-3 h-10 w-full md:w-96 py-1.5 border border-gray-950 rounded-lg flex items-center gap-3 focus-within:border-blue-600 ${getBorderColor(errors.cpf?.message)}`}>
                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0 text-gray-900"
                        placeholder="CPF"
                        {...register('cpf')}
                        maxLength={11}
                        onChange={(e) => setValue('cpf', e.target.value, { shouldValidate: true })}
                    />
                    {errors.cpf && <p className="text-red-500 text-xs">{errors.cpf.message}</p>}
                </div>

                <div className={`px-3 h-10 w-full md:w-96 py-1.5 mb-0 border border-gray-950 rounded-lg flex items-center focus-within:border-blue-600 ${getBorderColor(errors.senha?.message)}`}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0 text-gray-900"
                        placeholder="Senha"
                        {...register('senha')}
                        onChange={(e) => setValue('senha', e.target.value, { shouldValidate: true })}
                    />
                    <img
                        src={showPassword ? eyeSlash : eye}
                        alt="Mostrar/Ocultar"
                        onClick={toggleShowPassword}
                        className="cursor-pointer"
                    />
                    {errors.senha && <p className="text-red-500 text-xs">{errors.senha.message}</p>}
                </div>

                <Link to={"/recuperar"} className="text-right md:w-96 text-sm text-gray-800 hover:text-blue-700">Esqueceu a senha?</Link>

                <button type="submit" title='Acessar' className="px-4 py-2 w-full md:w-72 mt-6 mb-6 bg-gradient-to-r from-blue-500 to-gray-600 hover:from-blue-700 hover:to-gray-700 text-white rounded-md transition duration-300 ease-in-out" disabled={isSubmitting}>
                    {isSubmitting ? 'Acessando...' : 'ACESSAR'}
                </button>
            </form>
        </div>
    );
}
