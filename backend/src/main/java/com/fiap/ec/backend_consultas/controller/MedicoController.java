package com.fiap.ec.backend_consultas.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fiap.ec.backend_consultas.exception.RecursoNaoEncontradoException;
import com.fiap.ec.backend_consultas.model.Medico;
import com.fiap.ec.backend_consultas.service.MedicoService;

@RestController
@RequestMapping("/medicos")
@CrossOrigin
public class MedicoController {
    private final MedicoService service;

    public MedicoController(MedicoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Medico> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Medico buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Medico salvar(@RequestBody Medico medico) {
        return service.salvar(medico);
    }

    @PutMapping("/{id}")
    public Medico atualizar(@PathVariable Long id, @RequestBody Medico medico) {
        return service.atualizar(id, medico);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @GetMapping("/crm/{crm}")
    public Medico buscarPorCrm(@PathVariable String crm) {
        return service.buscarPorCrm(crm)
                .orElseThrow(() -> new RecursoNaoEncontradoException("CRM não encontrado."));
    }

    @GetMapping("/especialidade/{especialidadeId}")
    public List<Medico> listarPorEspecialidade(@PathVariable Long especialidadeId) {
        return service.listarPorEspecialidade(especialidadeId);
    }
}
