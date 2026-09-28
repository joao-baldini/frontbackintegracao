import api from "./api";
import { Consulta } from "../interfaces/consulta";
import { StatusConsulta } from "../types/statusConsulta";

/**
 * Tipo usado no formulário de agendamento.
 * Usa medicoId e pacienteId (números) em vez dos objetos completos,
 * pois o usuário só escolhe o ID no formulário.
 */
export type NovaConsulta = {
  medicoId: number;
  pacienteId: number;
  dataHora: string;
  status: StatusConsulta;
  valor: number;
  observacoes?: string;
};

export async function listarConsultas(): Promise<Consulta[]> {
  const response = await api.get<Consulta[]>("/consultas");
  return response.data;
}

export async function buscarConsultaPorId(id: number): Promise<Consulta> {
  const response = await api.get<Consulta>(`/consultas/${id}`);
  return response.data;
}

export async function agendarConsulta(novaConsulta: NovaConsulta): Promise<Consulta> {
  // Monta o payload no formato que o backend Spring Boot espera:
  // medico e paciente como objetos com apenas o id
  const payload = {
    medico: { id: novaConsulta.medicoId },
    paciente: { id: novaConsulta.pacienteId },
    dataHora: novaConsulta.dataHora,
    status: novaConsulta.status,
    valor: novaConsulta.valor,
    observacoes: novaConsulta.observacoes,
  };
  const response = await api.post<Consulta>("/consultas", payload);
  return response.data;
}

export async function confirmarConsulta(consulta: Consulta): Promise<Consulta> {
  const payload = {
    medico: { id: consulta.medico.id },
    paciente: { id: consulta.paciente.id },
    dataHora: consulta.dataHora,
    status: "confirmada" as StatusConsulta,
    valor: consulta.valor,
    observacoes: consulta.observacoes,
  };
  const response = await api.put<Consulta>(`/consultas/${consulta.id}`, payload);
  return response.data;
}

export async function cancelarConsulta(consulta: Consulta): Promise<Consulta> {
  const payload = {
    medico: { id: consulta.medico.id },
    paciente: { id: consulta.paciente.id },
    dataHora: consulta.dataHora,
    status: "cancelada" as StatusConsulta,
    valor: consulta.valor,
    observacoes: consulta.observacoes,
  };
  const response = await api.put<Consulta>(`/consultas/${consulta.id}`, payload);
  return response.data;
}

export async function listarConsultasPorMedico(medicoId: number): Promise<Consulta[]> {
  const response = await api.get<Consulta[]>(`/consultas/medico/${medicoId}`);
  return response.data;
}

export async function listarConsultasPorPaciente(pacienteId: number): Promise<Consulta[]> {
  const response = await api.get<Consulta[]>(`/consultas/paciente/${pacienteId}`);
  return response.data;
}
