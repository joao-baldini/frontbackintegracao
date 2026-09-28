import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Container principal do card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    // Sombra no iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Sombra no Android
    elevation: 5,
  },

  // Badge de status (agendada, confirmada, cancelada)
  statusBadge: {
    backgroundColor: "#FFA500", // Laranja (padrão para "agendada")
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusConfirmada: {
    backgroundColor: "#4CAF50", // Verde
  },
  statusCancelada: {
    backgroundColor: "#F44336", // Vermelho
  },
  statusTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  // Seções do card (médico, paciente, dados)
  secao: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  // Labels das seções (👨‍⚕️ Médico, 👤 Paciente, etc)
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#79059C",
    marginBottom: 8,
  },

  // Valores exibidos (nome do médico, nome do paciente, etc)
  valor: {
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },

  // Informações complementares (CRM, CPF, email, etc)
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },

  // Observações (texto em itálico)
  observacoes: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    marginTop: 8,
  },

  // Container das ações (botões e mensagens)
  acoes: {
    marginTop: 10,
  },

  // Espaçamento entre botões
  botaoContainer: {
    marginBottom: 12,
  },

  // Mensagem de sucesso (verde)
  mensagem: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },

  // Mensagem de cancelamento (vermelho)
  mensagemCancelada: {
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  mensagemTexto: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
});
