import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export function Login() {
    return (
        <div className="flex flex-col gap-4 ">
            <form action="">
                <div className="flex gap-3 items-center">
                    <h1 className="text-2xl font-bold">LOGIN</h1>
                    <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                        <input
                            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
                            placeholder="E-mail"
                        />
                    </div>
                    <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                        <input
                            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
                            placeholder="Senha"
                        />
                    </div>
                        <button>
                            ACESSAR
                        </button>
                </div>
            </form>
        </div>
    )
}