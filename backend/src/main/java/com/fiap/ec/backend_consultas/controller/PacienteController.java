package com.fiap.ec.backend_consultas.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fiap.ec.backend_consultas.exception.RecursoNaoEncontradoException;
import com.fiap.ec.backend_consultas.model.Paciente;
import com.fiap.ec.backend_consultas.service.PacienteService;

@RestController
@RequestMapping("/pacientes")
@CrossOrigin
public class PacienteController {
    private final PacienteService service;

    public PacienteController(PacienteService service) {
        this.service = service;
    }

    @PostMapping
    public Paciente criar(@RequestBody Paciente paciente) {
        return service.salvar(paciente);
    }

    @GetMapping
    public List<Paciente> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Paciente buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/cpf/{cpf}")
    public Paciente buscarPorCpf(@PathVariable String cpf) {
        return service.buscarPorCpf(cpf)
                .orElseThrow(() -> new RecursoNaoEncontradoException("CPF não encontrado."));
    }
}
