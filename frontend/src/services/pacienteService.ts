import api from "./api";
import { Paciente } from "../types/paciente";

export async function listarPacientes(): Promise<Paciente[]> {
  const response = await api.get<Paciente[]>("/pacientes");
  return response.data;
}

export async function buscarPacientePorId(id: number): Promise<Paciente> {
  const response = await api.get<Paciente>(`/pacientes/${id}`);
  return response.data;
}

export async function buscarPacientePorCpf(cpf: string): Promise<Paciente> {
  const response = await api.get<Paciente>(`/pacientes/cpf/${cpf}`);
  return response.data;
}

export async function cadastrarPaciente(
  dados: Omit<Paciente, "id">
): Promise<Paciente> {
  const response = await api.post<Paciente>("/pacientes", dados);
  return response.data;
}
