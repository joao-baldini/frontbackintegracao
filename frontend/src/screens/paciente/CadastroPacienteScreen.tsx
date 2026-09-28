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
import { cadastrarPaciente } from "../../services/pacienteService";
import { mensagemErroApi } from "../../utils/apiErro";
import { styles } from "../../styles/cadastroPaciente.styles";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CadastroPaciente">;
};

export default function CadastroPacienteScreen({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleCadastrar() {
    if (!nome.trim() || !cpf.trim() || !email.trim()) {
      setErro("Preencha os campos obrigatorios: nome, CPF e e-mail.");
      return;
    }
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      setErro("Digite um CPF valido com 11 digitos.");
      return;
    }
    try {
      setSalvando(true);
      setErro("");
      const paciente = await cadastrarPaciente({
        nome: nome.trim(),
        cpf: cpfLimpo,
        email: email.trim(),
        telefone: telefone.trim() || undefined,
      });
      // replace substitui a tela atual na pilha para o usuario nao voltar ao cadastro
      navigation.replace("MinhasConsultas", {
        pacienteId: paciente.id,
        pacienteNome: paciente.nome,
      });
    } catch (e) {
      setErro(
        mensagemErroApi(e, "Erro ao cadastrar. CPF ou e-mail ja podem estar em uso."),
      );
    } finally {
      setSalvando(false);
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
        <Text style={styles.titulo}>Criar Conta</Text>
        <Text style={styles.subtitulo}>
          Preencha seus dados para se cadastrar
        </Text>

        <View style={styles.formulario}>
          <Text style={styles.label}>Nome completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Joao da Silva"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>CPF * (somente numeros)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 12345678900"
            keyboardType="numeric"
            maxLength={11}
            value={cpf}
            onChangeText={(text) => setCpf(text.replace(/\D/g, ""))}
          />

          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: joao@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Telefone (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 11999999999"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />

          {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, salvando && styles.botaoDesabilitado]}
            onPress={handleCadastrar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Criar Conta</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
