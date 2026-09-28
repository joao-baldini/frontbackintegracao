import React from "react";
import { View, Text, Button } from "react-native";

// Importamos a interface Consulta que criamos na aula passada
// Ela vem de src/interfaces/ porque é usada em VÁRIOS lugares
import { Consulta } from "../interfaces/consulta";
import { styles } from "../styles/consultaCard.styles";

type ConsultaCardProps = {
  // A consulta que queremos exibir (OBRIGATÓRIA)
  consulta: Consulta;

  // Função chamada quando o usuário clica em "Confirmar" (OPCIONAL)
  // Por que opcional? Às vezes queremos só exibir, sem botões de ação!
  onConfirmar?: () => void;

  // Função chamada quando o usuário clica em "Cancelar" (OPCIONAL)
  onCancelar?: () => void;
};

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL
 * =============================================================================
 *
 * Aqui usamos destructuring nas props - é uma técnica moderna do JavaScript
 *
 * Em vez de: function ConsultaCard(props) { const consulta = props.consulta; }
 * Fazemos: function ConsultaCard({ consulta, onConfirmar, onCancelar })
 *
 * Fica mais limpo e direto!
 *
 * =============================================================================
 */
export default function ConsultaCard({
  consulta,
  onConfirmar,
  onCancelar,
}: ConsultaCardProps) {

  /**
   * ===========================================================================
   * FUNÇÕES AUXILIARES (LOCAIS DO COMPONENTE)
   * ===========================================================================
   *
   * Estas funções existem APENAS para ajudar este componente.
   * Por isso ficam aqui dentro, não precisam estar em outro arquivo.
   *
   * Se fossem usadas em vários componentes, criaríamos:
   * src/utils/formatadores.ts
   *
   * ===========================================================================
   */

  // Formata um número para moeda brasileira (R$ 150,00)
  function formatarValor(valor: number): string {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Formata uma string ISO do backend no padrão brasileiro (25/03/2026 às 09:00)
  function formatarData(dataHora: string): string {
    const data = new Date(dataHora);
    const dia = data.toLocaleDateString("pt-BR");
    const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `${dia} às ${hora}`;
  }

  return (
    <View style={styles.card}>

      {/*
        -----------------------------------------------------------------------
        BADGE DO STATUS
        -----------------------------------------------------------------------
        Renderização condicional de estilos!

        Se status === "confirmada" → aplica styles.statusConfirmada (verde)
        Se status === "cancelada"  → aplica styles.statusCancelada (vermelho)
        Se status === "agendada"   → só o estilo padrão (roxo)
        -----------------------------------------------------------------------
      */}
      <View
        style={[
          styles.statusBadge,
          consulta.status === "confirmada" && styles.statusConfirmada,
          consulta.status === "cancelada" && styles.statusCancelada,
        ]}
      >
        <Text style={styles.statusTexto}>
          {consulta.status.toUpperCase()}
        </Text>
      </View>

      {/*
        -----------------------------------------------------------------------
        SEÇÃO: MÉDICO
        -----------------------------------------------------------------------
        Exibimos todas as informações do médico.
        Repare que acessamos: consulta.medico.nome, consulta.medico.crm, etc.
        Isso funciona porque tipamos tudo com TypeScript!
        -----------------------------------------------------------------------
      */}
      <View style={styles.secao}>
        <Text style={styles.label}>👨‍⚕️ Médico</Text>
        <Text style={styles.valor}>{consulta.medico.nome}</Text>
        <Text style={styles.info}>CRM: {consulta.medico.crm}</Text>
        <Text style={styles.info}>{consulta.medico.especialidade.nome}</Text>
      </View>

      {/*
        -----------------------------------------------------------------------
        SEÇÃO: PACIENTE
        -----------------------------------------------------------------------
        Repare que telefone é OPCIONAL na interface Paciente!
        Se não existir, não renderizamos nada.
        Isso é renderização condicional baseada em dados opcionais.
        -----------------------------------------------------------------------
      */}
      <View style={styles.secao}>
        <Text style={styles.label}>👤 Paciente</Text>
        <Text style={styles.valor}>{consulta.paciente.nome}</Text>
        <Text style={styles.info}>CPF: {consulta.paciente.cpf}</Text>
        <Text style={styles.info}>Email: {consulta.paciente.email}</Text>
        {consulta.paciente.telefone && (
          <Text style={styles.info}>Tel: {consulta.paciente.telefone}</Text>
        )}
      </View>

      {/*
        -----------------------------------------------------------------------
        SEÇÃO: DADOS DA CONSULTA
        -----------------------------------------------------------------------
        Aqui usamos as funções auxiliares formatarData() e formatarValor()

        Em vez de:
        <Text>{consulta.data.toLocaleDateString("pt-BR")}</Text>

        Fazemos:
        <Text>{formatarData(consulta.data)}</Text>

        Fica mais legível e fácil de manter!
        -----------------------------------------------------------------------
      */}
      <View style={styles.secao}>
        <Text style={styles.label}>📅 Dados da Consulta</Text>
        <Text style={styles.valor}>Data: {formatarData(consulta.dataHora)}</Text>
        <Text style={styles.valor}>
          Valor: {formatarValor(consulta.valor)}
        </Text>
        {consulta.observacoes && (
          <Text style={styles.observacoes}>{consulta.observacoes}</Text>
        )}
      </View>

      {/*
        -----------------------------------------------------------------------
        BOTÕES DE AÇÃO (PROPS OPCIONAIS + CALLBACKS)
        -----------------------------------------------------------------------
        CONCEITO MUITO IMPORTANTE!

        Este componente NÃO gerencia o estado da consulta.
        Quem gerencia é o componente PAI (App.tsx).

        Renderização condicional em DOIS níveis:
        Nível 1: consulta.status === "agendada"
        → Só mostra botões se a consulta ainda estiver agendada

        Nível 2: onConfirmar && <Botao>
        → Só mostra o botão se a prop foi passada
        -----------------------------------------------------------------------
      */}
      <View style={styles.acoes}>
        {consulta.status === "agendada" && (
          <>
            {onConfirmar && (
              <View style={styles.botaoContainer}>
                <Button
                  title="Confirmar Consulta"
                  onPress={onConfirmar}
                  color="#4CAF50"
                />
              </View>
            )}
            {onCancelar && (
              <View style={styles.botaoContainer}>
                <Button
                  title="Cancelar Consulta"
                  onPress={onCancelar}
                  color="#F44336"
                />
              </View>
            )}
          </>
        )}

        {consulta.status === "confirmada" && (
          <View style={styles.mensagem}>
            <Text style={styles.mensagemTexto}>
              ✓ Consulta confirmada com sucesso!
            </Text>
          </View>
        )}

        {consulta.status === "cancelada" && (
          <View style={styles.mensagemCancelada}>
            <Text style={styles.mensagemTexto}>✗ Consulta cancelada</Text>
          </View>
        )}
      </View>
    </View>
  );
}
