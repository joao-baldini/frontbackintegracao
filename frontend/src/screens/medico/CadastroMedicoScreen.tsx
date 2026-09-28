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
import { RootStackParamList } from "../../navigation/types";
import { cadastrarMedico } from "../../services/medicoService";
import { listarEspecialidades } from "../../services/especialidadeService";
import { Especialidade } from "../../types/especialidade";
import { mensagemErroApi } from "../../utils/apiErro";
import { styles } from "../../styles/cadastroMedico.styles";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CadastroMedico">;
};

export default function CadastroMedicoScreen({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [valor, setValor] = useState("");
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState<Especialidade | null>(null);
  const [mostrarEspecialidades, setMostrarEspecialidades] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarEspecialidades()
      .then(setEspecialidades)
      .catch((e) =>
        setErro(mensagemErroApi(e, "Nao foi possivel carregar as especialidades.")),
      );
  }, []);

  async function handleCadastrar() {
    if (!nome.trim() || !crm.trim() || !especialidadeSelecionada) {
      setErro("Preencha os campos obrigatorios: nome, CRM e especialidade.");
      return;
    }

    let valorNum: number | null = null;
    if (valor.trim()) {
      valorNum = parseFloat(valor.replace(",", "."));
      if (isNaN(valorNum) || valorNum <= 0) {
        setErro("Digite um valor valido para a consulta.");
        return;
      }
    }

    try {
      setSalvando(true);
      setErro("");
      const medico = await cadastrarMedico({
        nome: nome.trim(),
        crm: crm.trim(),
        especialidade: especialidadeSelecionada,
        ativo: true,
        valorConsulta: valorNum,
      });
      if (medico.valorConsulta == null) {
        navigation.replace("PerfilMedico", {
          medicoId: medico.id,
          medicoNome: medico.nome,
        });
      } else {
        navigation.replace("ConsultasMedico", {
          medicoId: medico.id,
          medicoNome: medico.nome,
        });
      }
    } catch (e) {
      setErro(mensagemErroApi(e, "Erro ao cadastrar. CRM ja pode estar em uso."));
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
        <Text style={styles.titulo}>Cadastro de Medico</Text>
        <Text style={styles.subtitulo}>
          Preencha seus dados para criar sua conta
        </Text>

        <View style={styles.formulario}>
          {/* Nome */}
          <Text style={styles.label}>Nome completo * (inclua Dr. ou Dra.)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dr. Carlos Oliveira"
            value={nome}
            onChangeText={setNome}
          />

          {/* CRM */}
          <Text style={styles.label}>CRM * (somente numeros)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 123456"
            keyboardType="numeric"
            value={crm}
            onChangeText={(text) => setCrm(text.replace(/\D/g, ""))}
          />

          {/* Especialidade */}
          <Text style={styles.label}>Especialidade *</Text>
          <TouchableOpacity
            style={[
              styles.seletor,
              mostrarEspecialidades && styles.seletorAberto,
            ]}
            onPress={() => setMostrarEspecialidades(!mostrarEspecialidades)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.seletorTexto,
                !especialidadeSelecionada && styles.seletorPlaceholder,
              ]}
            >
              {especialidadeSelecionada
                ? especialidadeSelecionada.nome
                : "Selecione a especialidade"}
            </Text>
            <Text style={styles.seletorSeta}>
              {mostrarEspecialidades ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {mostrarEspecialidades && (
            <View style={styles.listaEspecialidades}>
              {especialidades.map((esp) => (
                <TouchableOpacity
                  key={String(esp.id)}
                  style={[
                    styles.itemEspecialidade,
                    especialidadeSelecionada?.id === esp.id &&
                      styles.itemSelecionado,
                  ]}
                  onPress={() => {
                    setEspecialidadeSelecionada(esp);
                    setMostrarEspecialidades(false);
                  }}
                >
                  <Text
                    style={[
                      styles.itemTexto,
                      especialidadeSelecionada?.id === esp.id &&
                        styles.itemTextoSelecionado,
                    ]}
                  >
                    {esp.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Valor */}
          <Text style={[styles.label, { marginTop: 16 }]}>
            Valor da Consulta (opcional)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 250.00"
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={setValor}
          />
          <Text style={styles.hint}>
            Pode ser preenchido agora ou depois no seu perfil.
          </Text>

          {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, salvando && styles.botaoDesabilitado]}
            onPress={handleCadastrar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
