import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import {
  listarConsultasPorMedico,
  confirmarConsulta,
  cancelarConsulta,
} from "../../services/consultaService";
import { Consulta } from "../../interfaces/consulta";
import { styles } from "../../styles/consultasMedico.styles";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ConsultasMedico">;
  route: RouteProp<RootStackParamList, "ConsultasMedico">;
};

const STATUS_FUNDO: Record<string, string> = {
  agendada: "#e3f2fd",
  confirmada: "#d4edda",
  realizada: "#e8f5e9",
  cancelada: "#f8d7da",
};

const STATUS_COR: Record<string, string> = {
  agendada: "#1565c0",
  confirmada: "#155724",
  realizada: "#1b5e20",
  cancelada: "#721c24",
};

const STATUS_LABEL: Record<string, string> = {
  agendada: "AGUARDANDO CONFIRMACAO",
  confirmada: "CONFIRMADA",
  realizada: "REALIZADA",
  cancelada: "CANCELADA",
};

function formatarDataHora(dataHora: string): string {
  const data = new Date(dataHora);
  const dia = data.toLocaleDateString("pt-BR");
  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dia} as ${hora}`;
}

export default function ConsultasMedicoScreen({ navigation, route }: Props) {
  const { medicoId, medicoNome } = route.params;
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  // Rastreia qual consulta esta sendo processada para desabilitar botoes
  const [processando, setProcessando] = useState<number | null>(null);

  // Recarrega sempre que a tela fica visivel
  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [medicoId])
  );

  async function carregarConsultas(pullRefresh = false) {
    if (pullRefresh) setAtualizando(true);
    else setCarregando(true);

    try {
      const lista = await listarConsultasPorMedico(medicoId);
      setConsultas(lista);
    } catch {
      // falha silenciosa no pull-to-refresh
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  async function handleConfirmar(consulta: Consulta) {
    setProcessando(consulta.id);
    try {
      await confirmarConsulta(consulta);
      await carregarConsultas();
    } finally {
      setProcessando(null);
    }
  }

  async function handleCancelar(consulta: Consulta) {
    setProcessando(consulta.id);
    try {
      await cancelarConsulta(consulta);
      await carregarConsultas();
    } finally {
      setProcessando(null);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={consultas}
        keyExtractor={(item) => String(item.id)}
        onRefresh={() => carregarConsultas(true)}
        refreshing={atualizando}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <View>
              <Text style={styles.titulo}>{medicoNome}</Text>
              <Text style={styles.subtitulo}>
                {consultas.length === 0 && !carregando
                  ? "Nenhuma consulta"
                  : `${consultas.length} consulta(s)`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.botaoSair}
              onPress={() =>
                navigation.reset({ index: 0, routes: [{ name: "Home" }] })
              }
            >
              <Text style={styles.botaoSairTexto}>Sair</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator
              color="#fff"
              size="large"
              style={{ marginTop: 40 }}
            />
          ) : (
            <View style={styles.vazio}>
              <Text style={styles.vazioTexto}>
                Nenhuma consulta agendada para voce no momento.{"\n"}
                Assim que um paciente agendar, aparecera aqui.
              </Text>
            </View>
          )
        }
        renderItem={({ item: consulta }) => {
          const emProcessamento = processando === consulta.id;
          return (
            <View style={styles.card}>
              {/* Badge de status */}
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      STATUS_FUNDO[consulta.status] ?? "#f0f0f0",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeTexto,
                    { color: STATUS_COR[consulta.status] ?? "#333" },
                  ]}
                >
                  {STATUS_LABEL[consulta.status] ??
                    consulta.status.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.cardPaciente}>
                Paciente: {consulta.paciente?.nome}
              </Text>
              <Text style={styles.cardInfo}>
                {formatarDataHora(consulta.dataHora)}
              </Text>
              <Text style={styles.cardInfo}>
                {Number(consulta.valor).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
              {consulta.observacoes && (
                <Text style={styles.cardObs}>{consulta.observacoes}</Text>
              )}

              {/* Acoes apenas para consultas com status "agendada" */}
              {consulta.status === "agendada" && (
                <View style={styles.acoes}>
                  <TouchableOpacity
                    style={[
                      styles.botaoAcao,
                      styles.botaoConfirmar,
                      emProcessamento && styles.botaoDesabilitado,
                    ]}
                    onPress={() => handleConfirmar(consulta)}
                    disabled={emProcessamento}
                  >
                    {emProcessamento ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.botaoAcaoTexto}>Confirmar</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.botaoAcao,
                      styles.botaoCancelar,
                      emProcessamento && styles.botaoDesabilitado,
                    ]}
                    onPress={() => handleCancelar(consulta)}
                    disabled={emProcessamento}
                  >
                    {emProcessamento ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.botaoAcaoTexto}>Cancelar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
