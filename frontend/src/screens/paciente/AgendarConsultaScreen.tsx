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
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { agendarConsulta } from "../../services/consultaService";
import { mensagemErroApi } from "../../utils/apiErro";
import { styles } from "../../styles/agendarConsulta.styles";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AgendarConsulta">;
  route: RouteProp<RootStackParamList, "AgendarConsulta">;
};

// Formata para exibicao ao usuario: "15/06/2026 as 10:30"
function formatarExibicao(date: Date): string {
  const dataParte = date.toLocaleDateString("pt-BR");
  const horaParte = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dataParte} as ${horaParte}`;
}

// Formata para o backend: "2026-06-15T10:30:00"
function formatarParaBackend(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

export default function AgendarConsultaScreen({ navigation, route }: Props) {
  const { pacienteId, pacienteNome, medicoId, medicoNome, medicoValor } =
    route.params;

  const [dataHora, setDataHora] = useState(new Date());
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function onChangeData(_event: DateTimePickerEvent, date?: Date) {
    if (date) {
      const nova = new Date(dataHora);
      nova.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      setDataHora(nova);
    }
  }

  function onChangeHora(_event: DateTimePickerEvent, date?: Date) {
    if (date) {
      const nova = new Date(dataHora);
      nova.setHours(date.getHours(), date.getMinutes(), 0, 0);
      setDataHora(nova);
    }
  }

  async function handleAgendar() {
    try {
      setSalvando(true);
      setErro("");
      await agendarConsulta({
        medicoId,
        pacienteId,
        dataHora: formatarParaBackend(dataHora),
        valor: medicoValor ?? 0,
        status: "agendada",
        observacoes: observacoes.trim() || undefined,
      });
      navigation.navigate("MinhasConsultas", { pacienteId, pacienteNome });
    } catch (e) {
      setErro(mensagemErroApi(e, "Erro ao agendar consulta. Tente novamente."));
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
        <Text style={styles.titulo}>Agendar Consulta</Text>

        <View style={styles.formulario}>
          {/* Medico selecionado */}
          <View style={styles.infoMedico}>
            <Text style={styles.infoMedicoLabel}>Medico selecionado</Text>
            <Text style={styles.infoMedicoNome}>{medicoNome}</Text>
          </View>

          {/* Seletor de data */}
          <Text style={styles.label}>Data da Consulta *</Text>
          <DateTimePicker
            value={dataHora}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "spinner"}
            minimumDate={new Date()}
            onChange={onChangeData}
          />

          {/* Seletor de hora */}
          <Text style={[styles.label, { marginTop: 8 }]}>Hora da Consulta *</Text>
          <DateTimePicker
            value={dataHora}
            mode="time"
            display="spinner"
            onChange={onChangeHora}
          />

          <Text style={styles.dataSelecionada}>
            Agendado para: {formatarExibicao(dataHora)}
          </Text>

          {/* Valor - somente leitura, definido pelo medico */}
          <Text style={styles.label}>Valor da Consulta</Text>
          <View style={styles.campoValorTravado}>
            <Text style={styles.campoValorTexto}>
              {medicoValor != null
                ? `R$ ${medicoValor.toFixed(2).replace(".", ",")}`
                : "A definir pelo medico"}
            </Text>
            <Text style={styles.campoValorBloqueado}>(bloqueado)</Text>
          </View>
          <Text style={styles.hint}>
            O valor e definido pelo medico e nao pode ser alterado.
          </Text>

          {/* Observacoes */}
          <Text style={[styles.label, { marginTop: 8 }]}>
            Observacoes (opcional)
          </Text>
          <TextInput
            style={[styles.input, styles.inputMultilinha]}
            placeholder="Ex: Retorno, trazer exames..."
            multiline
            numberOfLines={3}
            value={observacoes}
            onChangeText={setObservacoes}
          />

          {/* Aviso sobre o fluxo de confirmacao */}
          <View style={styles.aviso}>
            <Text style={styles.avisoTexto}>
              Sua consulta ficara com status "Aguardando Confirmacao" ate o
              medico confirmar.
            </Text>
          </View>

          {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, salvando && styles.botaoDesabilitado]}
            onPress={handleAgendar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Confirmar Agendamento</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
