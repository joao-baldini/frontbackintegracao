import { AxiosError } from "axios";

type CorpoErro = {
  erro?: string;
};

export function mensagemErroApi(erro: unknown, fallback: string): string {
  const axiosError = erro as AxiosError<CorpoErro>;
  const mensagem = axiosError.response?.data?.erro;
  if (typeof mensagem === "string" && mensagem.trim()) {
    return mensagem;
  }
  return fallback;
}
