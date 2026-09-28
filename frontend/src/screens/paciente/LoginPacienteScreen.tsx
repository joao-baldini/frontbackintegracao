import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { isNetworkError } from "../../services/api";
import { buscarPacientePorCpf } from "../../services/pacienteService";
import { mensagemErroApi } from "../../utils/apiErro";
import { styles } from "../../styles/loginPaciente.styles";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "LoginPaciente">;
};

export default function LoginPacienteScreen({ navigation }: Props) {
  const [cpf, setCpf] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleEntrar() {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      setErro("Digite um CPF valido com 11 digitos.");
      return;
    }
    try {
      setCarregando(true);
      setErro("");
      const paciente = await buscarPacientePorCpf(cpfLimpo);
      navigation.navigate("MinhasConsultas", {
        pacienteId: paciente.id,
        pacienteNome: paciente.nome,
      });
    } catch (e) {
      if (isNetworkError(e)) {
        setErro(
          "Servidor indisponivel. Verifique se o backend esta rodando e tente novamente."
        );
      } else {
        setErro(mensagemErroApi(e, "CPF nao encontrado. Verifique ou crie um cadastro."));
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Bem-vindo!</Text>
        <Text style={styles.subtitulo}>
          Digite seu CPF para acessar suas consultas
        </Text>

        <View style={styles.formulario}>
          <Text style={styles.label}>CPF (somente numeros)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 12345678900"
            keyboardType="numeric"
            maxLength={11}
            value={cpf}
            onChangeText={(text) => {
              setCpf(text.replace(/\D/g, ""));
              setErro("");
            }}
          />

          {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleEntrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.separador}>
            <View style={styles.linha} />
            <Text style={styles.separadorTexto}>ou</Text>
            <View style={styles.linha} />
          </View>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate("CadastroPaciente")}
          >
            <Text style={styles.botaoSecundarioTexto}>
              Nao tenho cadastro - Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
