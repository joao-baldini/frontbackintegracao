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
import { listarConsultasPorPaciente } from "../../services/consultaService";
import { Consulta } from "../../interfaces/consulta";
import { styles } from "../../styles/minhasConsultas.styles";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MinhasConsultas">;
  route: RouteProp<RootStackParamList, "MinhasConsultas">;
};

// Cores de fundo dos badges de status
const STATUS_FUNDO: Record<string, string> = {
  agendada: "#e3f2fd",
  confirmada: "#d4edda",
  realizada: "#e8f5e9",
  cancelada: "#f8d7da",
};

// Cores do texto dos badges de status
const STATUS_COR: Record<string, string> = {
  agendada: "#1565c0",
  confirmada: "#155724",
  realizada: "#1b5e20",
  cancelada: "#721c24",
};

// Texto amigavel para cada status
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

export default function MinhasConsultasScreen({ navigation, route }: Props) {
  const { pacienteId, pacienteNome } = route.params;
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  // useFocusEffect recarrega os dados cada vez que a tela fica visivel.
  // Isso garante que, ao voltar da tela de agendamento, a lista esta atualizada.
  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [pacienteId])
  );

  async function carregarConsultas(pullRefresh = false) {
    if (pullRefresh) setAtualizando(true);
    else setCarregando(true);

    try {
      const lista = await listarConsultasPorPaciente(pacienteId);
      setConsultas(lista);
    } catch {
      // falha silenciosa no pull-to-refresh
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  const primeiroNome = pacienteNome.split(" ")[0];

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
              <Text style={styles.titulo}>Ola, {primeiroNome}!</Text>
              <Text style={styles.subtitulo}>
                {consultas.length === 0 && !carregando
                  ? "Nenhuma consulta encontrada"
                  : `${consultas.length} consulta(s)`}
              </Text>
            </View>
            <View style={styles.cabecalhoAcoes}>
              <TouchableOpacity
                style={styles.botaoAgendar}
                onPress={() =>
                  navigation.navigate("EscolhaEspecialidade", {
                    pacienteId,
                    pacienteNome,
                  })
                }
              >
                <Text style={styles.botaoAgendarTexto}>+ Agendar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoSair}
                onPress={() =>
                  navigation.reset({ index: 0, routes: [{ name: "Home" }] })
                }
              >
                <Text style={styles.botaoSairTexto}>Sair</Text>
              </TouchableOpacity>
            </View>
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
                Voce ainda nao tem consultas.{"\n"}
                Toque em "+ Agendar" para marcar a sua primeira consulta!
              </Text>
            </View>
          )
        }
        renderItem={({ item: consulta }) => (
          <View style={styles.card}>
            {/* Badge de status */}
            <View
              style={[
                styles.badge,
                { backgroundColor: STATUS_FUNDO[consulta.status] ?? "#f0f0f0" },
              ]}
            >
              <Text
                style={[
                  styles.badgeTexto,
                  { color: STATUS_COR[consulta.status] ?? "#333" },
                ]}
              >
                {STATUS_LABEL[consulta.status] ?? consulta.status.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.cardMedico}>{consulta.medico?.nome}</Text>
            <Text style={styles.cardInfo}>
              {consulta.medico?.especialidade?.nome}
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
          </View>
        )}
      />
    </View>
  );
}
