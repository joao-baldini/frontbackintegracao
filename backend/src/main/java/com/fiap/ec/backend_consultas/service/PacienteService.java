package com.fiap.ec.backend_consultas.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fiap.ec.backend_consultas.exception.DadosInvalidosException;
import com.fiap.ec.backend_consultas.exception.RecursoDuplicadoException;
import com.fiap.ec.backend_consultas.exception.RecursoNaoEncontradoException;
import com.fiap.ec.backend_consultas.model.Paciente;
import com.fiap.ec.backend_consultas.repository.PacienteRepository;

@Service
public class PacienteService {
    private final PacienteRepository repository;

    public PacienteService(PacienteRepository repository) {
        this.repository = repository;
    }

    public Paciente salvar(Paciente paciente) {
        normalizar(paciente);
        validarObrigatorios(paciente);
        if (repository.existsByCpf(paciente.getCpf())) {
            throw new RecursoDuplicadoException("CPF já cadastrado.");
        }
        if (repository.existsByEmailIgnoreCase(paciente.getEmail())) {
            throw new RecursoDuplicadoException("E-mail já cadastrado.");
        }
        if (paciente.getAtivo() == null) {
            paciente.setAtivo(true);
        }
        return repository.save(paciente);
    }

    public List<Paciente> listar() {
        return repository.findAll();
    }

    public Paciente buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Paciente não encontrado"));
    }

    public Optional<Paciente> buscarPorCpf(String cpf) {
        if (cpf == null || cpf.isBlank()) {
            return Optional.empty();
        }
        return repository.findByCpf(cpf.trim());
    }

    private void normalizar(Paciente paciente) {
        if (paciente.getNome() != null) {
            paciente.setNome(paciente.getNome().trim());
        }
        if (paciente.getCpf() != null) {
            paciente.setCpf(paciente.getCpf().replaceAll("\\D", ""));
        }
        if (paciente.getEmail() != null) {
            paciente.setEmail(paciente.getEmail().trim());
        }
        if (paciente.getTelefone() != null && paciente.getTelefone().isBlank()) {
            paciente.setTelefone(null);
        }
    }

    private void validarObrigatorios(Paciente paciente) {
        if (paciente.getNome() == null || paciente.getNome().isBlank()) {
            throw new DadosInvalidosException("Nome do paciente é obrigatório.");
        }
        if (paciente.getCpf() == null || paciente.getCpf().length() != 11) {
            throw new DadosInvalidosException("CPF deve conter 11 dígitos.");
        }
        if (paciente.getEmail() == null || paciente.getEmail().isBlank()
                || !paciente.getEmail().contains("@")) {
            throw new DadosInvalidosException("E-mail válido é obrigatório.");
        }
    }
}
