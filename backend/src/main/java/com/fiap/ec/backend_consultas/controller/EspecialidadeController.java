package com.fiap.ec.backend_consultas.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fiap.ec.backend_consultas.model.Especialidade;
import com.fiap.ec.backend_consultas.service.EspecialidadeService;

@RestController
@RequestMapping("/especialidades")
@CrossOrigin
public class EspecialidadeController {
    private final EspecialidadeService service;

    public EspecialidadeController(EspecialidadeService service) {
        this.service = service;
    }

    @PostMapping
    public Especialidade criar(@RequestBody Especialidade especialidade) {
        return service.salvar(especialidade);
    }

    @GetMapping
    public List<Especialidade> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Especialidade buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }
}
