export type RootStackParamList = {
  Home: undefined;

  // Fluxo Paciente
  LoginPaciente: undefined;
  CadastroPaciente: undefined;
  MinhasConsultas: { pacienteId: number; pacienteNome: string };
  EscolhaEspecialidade: { pacienteId: number; pacienteNome: string };
  EscolhaMedico: {
    pacienteId: number;
    pacienteNome: string;
    especialidadeId: number;
    especialidadeNome: string;
  };
  AgendarConsulta: {
    pacienteId: number;
    pacienteNome: string;
    medicoId: number;
    medicoNome: string;
    medicoValor: number | null;
  };

  // Fluxo Medico
  LoginMedico: undefined;
  CadastroMedico: undefined;
  PerfilMedico: { medicoId: number; medicoNome: string };
  ConsultasMedico: { medicoId: number; medicoNome: string };
};
