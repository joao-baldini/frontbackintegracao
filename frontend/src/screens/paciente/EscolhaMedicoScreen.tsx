import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { listarMedicosPorEspecialidade } from "../../services/medicoService";
import { Medico } from "../../interfaces/medico";
import { styles } from "../../styles/escolhaMedico.styles";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "EscolhaMedico">;
  route: RouteProp<RootStackParamList, "EscolhaMedico">;
};

export default function EscolhaMedicoScreen({ navigation, route }: Props) {
  const { pacienteId, pacienteNome, especialidadeId, especialidadeNome } =
    route.params;
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Filtra apenas medicos ativos E com valor de consulta definido
    listarMedicosPorEspecialidade(especialidadeId)
      .then((lista) =>
        setMedicos(lista.filter((m) => m.ativo && m.valorConsulta != null))
      )
      .finally(() => setCarregando(false));
  }, [especialidadeId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={medicos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.titulo}>
            Medicos de {especialidadeNome}
          </Text>
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
                Nenhum medico disponivel para esta especialidade no momento.
              </Text>
            </View>
          )
        }
        renderItem={({ item: medico }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("AgendarConsulta", {
                pacienteId,
                pacienteNome,
                medicoId: medico.id,
                medicoNome: medico.nome,
                medicoValor: medico.valorConsulta,
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.cardTextos}>
              <Text style={styles.cardNome}>{medico.nome}</Text>
              <Text style={styles.cardCrm}>CRM: {medico.crm}</Text>
              {medico.valorConsulta != null && (
                <Text style={styles.cardValor}>
                  R$ {medico.valorConsulta.toFixed(2).replace(".", ",")}
                </Text>
              )}
            </View>
            <Text style={styles.cardSeta}>-&gt;</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
