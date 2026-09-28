package com.fiap.ec.backend_consultas;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fiap.ec.backend_consultas.model.Especialidade;
import com.fiap.ec.backend_consultas.model.Medico;
import com.fiap.ec.backend_consultas.model.Paciente;
import com.fiap.ec.backend_consultas.repository.EspecialidadeRepository;
import com.fiap.ec.backend_consultas.repository.MedicoRepository;
import com.fiap.ec.backend_consultas.repository.PacienteRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ApiExceptionIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Test
    void deveInformarQueOBackendEstaDisponivel() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void deveTraduzirErrosDeNegocioParaHttpComMensagem() throws Exception {
        String sufixo = Long.toString(Math.floorMod(System.nanoTime(), 1_000_000_000L));
        String crm = "CRM-TESTE-" + sufixo;
        String cpf = "9" + String.format("%010d", Math.floorMod(System.nanoTime(), 10_000_000_000L));
        String outroCpf = "8" + cpf.substring(1);
        String email = "exception." + sufixo + "@fiap.test";

        Especialidade especialidade = especialidadeRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> especialidadeRepository.save(novaEspecialidade("Teste API")));

        Medico medico = new Medico();
        medico.setNome("Dr. Teste");
        medico.setCrm(crm);
        medico.setEspecialidade(especialidade);
        medico.setAtivo(true);
        medicoRepository.saveAndFlush(medico);

        Paciente paciente = new Paciente();
        paciente.setNome("Paciente Teste");
        paciente.setCpf(cpf);
        paciente.setEmail(email);
        paciente.setAtivo(true);
        pacienteRepository.saveAndFlush(paciente);

        mockMvc.perform(get("/medicos/crm/CRM-INEXISTENTE"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.erro").value("CRM não encontrado."));

        mockMvc.perform(post("/medicos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nome":"Dr. Clone","crm":"%s",\
                                "especialidade":{"id":%d},"ativo":true,"valorConsulta":100}
                                """.formatted(crm, especialidade.getId())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.erro").value("CRM já cadastrado."));

        mockMvc.perform(post("/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nome":"Clone CPF","cpf":"%s",\
                                "email":"outro@fiap.test"}
                                """.formatted(cpf)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.erro").value("CPF já cadastrado."));

        mockMvc.perform(post("/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nome":"Clone Email","cpf":"%s",\
                                "email":"%s"}
                                """.formatted(outroCpf, email.toUpperCase())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.erro").value("E-mail já cadastrado."));

        mockMvc.perform(post("/especialidades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"" + especialidade.getNome().toUpperCase() + "\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.erro").value("Especialidade já cadastrada."));

        mockMvc.perform(post("/medicos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Dr. Sem CRM\",\"crm\":\"\",\"especialidade\":{\"id\":"
                                + especialidade.getId() + "}}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("CRM é obrigatório."));
    }

    private Especialidade novaEspecialidade(String nome) {
        Especialidade especialidade = new Especialidade();
        especialidade.setNome(nome);
        return especialidade;
    }
}
