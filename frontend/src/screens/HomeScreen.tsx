import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { healthCheck } from "../services/api";
import { styles } from "../styles/homeScreen.styles";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

type StatusServico = "verificando" | "online" | "offline";

export default function HomeScreen({ navigation }: Props) {
  const [statusServico, setStatusServico] = useState<StatusServico>("verificando");

  useEffect(() => {
    verificarServico();
  }, []);

  async function verificarServico() {
    setStatusServico("verificando");
    const disponivel = await healthCheck();
    setStatusServico(disponivel ? "online" : "offline");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#79059C" />
      <View style={styles.content}>
        <Text style={styles.titulo}>Sistema de Consultas</Text>
        <Text style={styles.subtitulo}>Como deseja acessar?</Text>

        {statusServico === "verificando" && (
          <View style={[styles.banner, styles.bannerVerificando]}>
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.bannerTexto}>Verificando conexão com o servidor...</Text>
          </View>
        )}

        {statusServico === "offline" && (
          <View style={[styles.banner, styles.bannerOffline]}>
            <Text style={styles.bannerTexto}>
              ⚠ Servidor indisponível. Tente novamente mais tarde.
            </Text>
            <TouchableOpacity
              onPress={verificarServico}
              style={styles.tentarNovamenteBotao}
            >
              <Text style={styles.tentarNovamenteTexto}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botao Paciente */}
        <TouchableOpacity
          style={[styles.botao, statusServico === "offline" && styles.botaoDesabilitado]}
          onPress={() => navigation.navigate("LoginPaciente")}
          activeOpacity={0.85}
          disabled={statusServico === "offline"}
        >
          <Text style={styles.botaoTitulo}>Sou Paciente</Text>
          <Text style={styles.botaoDescricao}>
            Agende consultas e acompanhe seus atendimentos
          </Text>
        </TouchableOpacity>

        {/* Botao Medico */}
        <TouchableOpacity
          style={[
            styles.botao,
            styles.botaoMedico,
            statusServico === "offline" && styles.botaoMedicoDesabilitado,
          ]}
          onPress={() => navigation.navigate("LoginMedico")}
          activeOpacity={0.85}
          disabled={statusServico === "offline"}
        >
          <Text style={[styles.botaoTitulo, styles.botaoMedicoTitulo]}>
            Sou Medico
          </Text>
          <Text style={[styles.botaoDescricao, styles.botaoMedicoDescricao]}>
            Gerencie suas consultas agendadas
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
