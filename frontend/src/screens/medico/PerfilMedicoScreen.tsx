import React, { useState, useEffect } from "react";
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
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import {
  buscarMedicoPorId,
  atualizarMedico,
} from "../../services/medicoService";
import { Medico } from "../../interfaces/medico";
import { mensagemErroApi } from "../../utils/apiErro";
import { styles } from "../../styles/perfilMedico.styles";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PerfilMedico">;
  route: RouteProp<RootStackParamList, "PerfilMedico">;
};

export default function PerfilMedicoScreen({ navigation, route }: Props) {
  const { medicoId, medicoNome } = route.params;
  const [medico, setMedico] = useState<Medico | null>(null);
  const [valorConsulta, setValorConsulta] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarMedicoPorId(medicoId)
      .then((m) => {
        setMedico(m);
        if (m.valorConsulta != null) {
          setValorConsulta(String(m.valorConsulta).replace(".", ","));
        }
      })
      .catch((e) => setErro(mensagemErroApi(e, "Nao foi possivel carregar o perfil.")))
      .finally(() => setCarregando(false));
  }, [medicoId]);

  async function handleSalvar() {
    const valorNum = parseFloat(valorConsulta.replace(",", "."));
    if (!valorConsulta.trim() || isNaN(valorNum) || valorNum <= 0) {
      setErro("Digite um valor valido para a consulta (ex: 250,00).");
      return;
    }
    if (!medico) return;

    try {
      setSalvando(true);
      setErro("");
      await atualizarMedico(medicoId, { ...medico, valorConsulta: valorNum });
      navigation.replace("ConsultasMedico", { medicoId, medicoNome });
    } catch (e) {
      setErro(mensagemErroApi(e, "Erro ao salvar. Verifique a conexao e tente novamente."));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
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
        <Text style={styles.titulo}>Complete seu Perfil</Text>

        <View style={styles.formulario}>
          <View style={styles.avisoBox}>
            <Text style={styles.avisoTexto}>
              Para acessar o sistema, voce precisa cadastrar o valor da sua
              consulta. O cadastro fica inativo ate que todos os dados
              obrigatorios sejam preenchidos.
            </Text>
          </View>

          <View style={styles.infoMedico}>
            <Text style={styles.infoLabel}>Medico(a)</Text>
            <Text style={styles.infoNome}>{medicoNome}</Text>
            {medico?.especialidade && (
              <Text style={styles.infoEsp}>{medico.especialidade.nome}</Text>
            )}
          </View>

          <Text style={styles.label}>Valor da Consulta (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 250,00"
            placeholderTextColor="#aaa"
            keyboardType="decimal-pad"
            value={valorConsulta}
            onChangeText={(t) => {
              setValorConsulta(t);
              setErro("");
            }}
          />
          <Text style={styles.hint}>
            Este valor sera exibido para os pacientes ao agendar com voce.
          </Text>

          {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, salvando && styles.botaoDesabilitado]}
            onPress={handleSalvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Salvar e Continuar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
