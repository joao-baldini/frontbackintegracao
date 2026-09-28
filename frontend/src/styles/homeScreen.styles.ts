import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#79059C",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 32,
  },
  banner: {
    width: "100%",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  bannerVerificando: {
    backgroundColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
  },
  bannerOffline: {
    backgroundColor: "rgba(220, 53, 69, 0.85)",
  },
  bannerTexto: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  tentarNovamenteBotao: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tentarNovamenteTexto: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  botao: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  botaoDesabilitado: {
    opacity: 0.4,
  },
  botaoMedico: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
    shadowOpacity: 0,
    elevation: 0,
  },
  botaoMedicoDesabilitado: {
    opacity: 0.4,
  },
  botaoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#79059C",
    marginBottom: 4,
  },
  botaoDescricao: {
    fontSize: 13,
    color: "#999",
  },
  botaoMedicoTitulo: {
    color: "#fff",
  },
  botaoMedicoDescricao: {
    color: "rgba(255,255,255,0.75)",
  },
});
