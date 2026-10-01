package com.fiap.ec.backend_consultas;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fiap.ec.backend_consultas.model.*;
import com.fiap.ec.backend_consultas.repository.*;

/**
 * DataLoader - executado automaticamente ao iniciar o backend.
 *
 * Semeia todos os dados caso as tabelas estejam vazias.
 * Garante que o app funcione tanto localmente quanto na nuvem
 * (onde o H2 começa do zero a cada reinicialização).
 *
 * Ordem: Especialidades → Médicos → Pacientes → Consultas
 */
@Component
@org.springframework.core.annotation.Order(10)
public class DataLoader implements CommandLineRunner {

    private final EspecialidadeRepository especialidadeRepository;
    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;
    private final ConsultaRepository consultaRepository;

    public DataLoader(EspecialidadeRepository especialidadeRepository,
                      MedicoRepository medicoRepository,
                      PacienteRepository pacienteRepository,
                      ConsultaRepository consultaRepository) {
        this.especialidadeRepository = especialidadeRepository;
        this.medicoRepository = medicoRepository;
        this.pacienteRepository = pacienteRepository;
        this.consultaRepository = consultaRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        // 1. Especialidades
        if (especialidadeRepository.count() == 0) {
            especialidadeRepository.saveAll(List.of(
                new Especialidade("Cardiologia",  "Especialidade do  coração"),
                new Especialidade("Dermatologia", "Tratamento de doenças da  pele"),
                new Especialidade("Ortopedia",    "Sistema músculo- esquelético"),
                new Especialidade("Pediatria",    "Saúde de crianças e  adolescentes"),
                new Especialidade("Neurologia",   "Sistema nervoso central e  periférico"),
                new Especialidade("Ginecologia",  "Saúde da mulher"),
                new Especialidade("Oftalmologia", "Saúde dos olhos")
            ));
        }

        // 2. Médicos
        if (medicoRepository.count() == 0) {
            List<Especialidade> esp = especialidadeRepository.findAll();
            medicoRepository.saveAll(List.of(
                medico("Dr. Roberto Silva",  "789456", esp.get(0), 750.00),
                medico("Dra. Ana Ferreira",  "123789", esp.get(1), 480.00),
                medico("Dr. Carlos Mendes",  "456123", esp.get(2), 550.00),
                medico("Dra. Patricia Lima", "321654", esp.get(3), 420.00),
                medico("Dr. Fernando Souza", "654321", esp.get(4), 680.00)
            ));
        }

        // 3. Pacientes
        if (pacienteRepository.count() == 0) {
            pacienteRepository.saveAll(List.of(
                paciente("Maria Silva",    "12345678901", "maria@email.com",  
"11999991111", "1990-03-15"),
                paciente("João Santos",    "98765432100", "joao@email.com",   
"11988882222", "1985-07-22"),
                paciente("Ana Costa",      "11122233344", "ana@email.com",    
null,          "1995-11-08"),
                paciente("Pedro Oliveira", "55544433322", "pedro@email.com",  
"11977773333", "1978-01-30"),
                paciente("Lucia Fernandes","66677788899", "lucia@email.com",  
"11966664444", "2001-05-17")
            ));
        }

        // 4. Consultas
        if (consultaRepository.count() == 0) {
            List<Medico>   ms = medicoRepository.findAll();
            List<Paciente> ps = pacienteRepository.findAll();
            consultaRepository.saveAll(List.of(
                new Consulta(ms.get(0), ps.get(0), LocalDateTime.of(2026,10, 
5,  9, 0), "agendada",   750.0, "Consulta de rotina"),
                new Consulta(ms.get(1), ps.get(1), LocalDateTime.of(2026,10, 
6, 14,30), "confirmada", 480.0, "Retorno pós-exame"),
                new Consulta(ms.get(2), ps.get(2), LocalDateTime.of(2026,10, 
7, 10, 0), "agendada",   550.0, null),
                new Consulta(ms.get(0), ps.get(1), LocalDateTime.of(2026, 
9,20, 11, 0), "realizada",  750.0, "Exame em dia"),
                new Consulta(ms.get(1), ps.get(2), LocalDateTime.of(2026, 
9,18, 16, 0), "cancelada",  480.0, "Paciente desmarcou"),
                new Consulta(ms.get(2), ps.get(0), 
LocalDateTime.of(2026,10,12,  8,30), "agendada",   550.0, "Primeira  consulta")
            ));
        }

        System.out.println("DataLoader: banco de dados pronto.");
    }

    private Medico medico(String nome, String crm, Especialidade esp, double 
valor) {
        Medico m = new Medico();
        m.setNome(nome); m.setCrm(crm); m.setEspecialidade(esp);
        m.setAtivo(true); m.setValorConsulta(valor);
        return m;
    }

    private Paciente paciente(String nome, String cpf, String email,
                              String telefone, String dataNasc) {
        Paciente p = new Paciente();
        p.setNome(nome); p.setCpf(cpf); p.setEmail(email);
        p.setTelefone(telefone); 
p.setDataNascimento(LocalDate.parse(dataNasc));
        p.setAtivo(true);
        return p;
    }
}
