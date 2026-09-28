/**
 * App.tsx - Aplicativo de Consultas Medicas
 * Versao 6: Navegacao por Telas + Fluxos Paciente e Medico
 *
 * Evolucao:
 * Aula 1 (23/03) -> MVP Simples
 * Aula 2 (06/04) -> Integracao TypeScript
 * Aula 3 (13/04) -> Componentizacao
 * Aula 4 (04/05) -> Integracao com Backend (medicos e pacientes)
 * Aula 5 (11/05) -> Consultas + Formulario de Agendamento
 * Aula 6 (18/05) -> Navegacao + Fluxos Paciente e Medico <- VOCE ESTA AQUI
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "./src/navigation/types";

// Tela inicial
import HomeScreen from "./src/screens/HomeScreen";

// Fluxo Paciente
import LoginPacienteScreen from "./src/screens/paciente/LoginPacienteScreen";
import CadastroPacienteScreen from "./src/screens/paciente/CadastroPacienteScreen";
import MinhasConsultasScreen from "./src/screens/paciente/MinhasConsultasScreen";
import EscolhaEspecialidadeScreen from "./src/screens/paciente/EscolhaEspecialidadeScreen";
import EscolhaMedicoScreen from "./src/screens/paciente/EscolhaMedicoScreen";
import AgendarConsultaScreen from "./src/screens/paciente/AgendarConsultaScreen";

// Fluxo Medico
import LoginMedicoScreen from "./src/screens/medico/LoginMedicoScreen";
import CadastroMedicoScreen from "./src/screens/medico/CadastroMedicoScreen";
import PerfilMedicoScreen from "./src/screens/medico/PerfilMedicoScreen";
import ConsultasMedicoScreen from "./src/screens/medico/ConsultasMedicoScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#79059C" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* Tela inicial - sem cabecalho */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Fluxo Paciente */}
        <Stack.Screen
          name="LoginPaciente"
          component={LoginPacienteScreen}
          options={{ title: "Acesso do Paciente" }}
        />
        <Stack.Screen
          name="CadastroPaciente"
          component={CadastroPacienteScreen}
          options={{ title: "Cadastro de Paciente" }}
        />
        <Stack.Screen
          name="MinhasConsultas"
          component={MinhasConsultasScreen}
          options={{ title: "Minhas Consultas", headerBackVisible: false }}
        />
        <Stack.Screen
          name="EscolhaEspecialidade"
          component={EscolhaEspecialidadeScreen}
          options={{ title: "Escolha a Especialidade" }}
        />
        <Stack.Screen
          name="EscolhaMedico"
          component={EscolhaMedicoScreen}
          options={{ title: "Escolha o Medico" }}
        />
        <Stack.Screen
          name="AgendarConsulta"
          component={AgendarConsultaScreen}
          options={{ title: "Agendar Consulta" }}
        />

        {/* Fluxo Medico */}
        <Stack.Screen
          name="LoginMedico"
          component={LoginMedicoScreen}
          options={{ title: "Acesso do Medico" }}
        />
        <Stack.Screen          name="CadastroMedico"
          component={CadastroMedicoScreen}
          options={{ title: "Cadastro de Medico" }}
        />
        <Stack.Screen          name="PerfilMedico"
          component={PerfilMedicoScreen}
          options={{ title: "Complete seu Perfil", headerBackVisible: false }}
        />
        <Stack.Screen
          name="ConsultasMedico"
          component={ConsultasMedicoScreen}
          options={{ title: "Consultas Agendadas", headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
