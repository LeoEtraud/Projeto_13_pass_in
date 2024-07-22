import { Header } from "./components/header";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes";

export function App() {

  return (
    <div className="max-w-[1216px] mx-auto py-5 flex flex-col gap-5">
      <BrowserRouter>
        <Header />
        <Router />
      </BrowserRouter>
    </div>
  )
}
