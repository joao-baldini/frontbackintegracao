import { Medico } from "./medico";
import { Paciente } from "../types/paciente";
import { StatusConsulta } from "../types/statusConsulta";

export interface Consulta {
  id: number;
  medico: Medico;
  paciente: Paciente;
  dataHora: string; // ISO string vindo do backend (ex: "2026-05-20T09:00:00")
  valor: number;
  status: StatusConsulta;
  observacoes?: string;
}