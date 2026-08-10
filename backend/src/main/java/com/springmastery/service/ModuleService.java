package com.springmastery.service;

import com.springmastery.domain.Module;
import com.springmastery.dto.ModuleResponse;
import com.springmastery.exception.ResourceNotFoundException;
import com.springmastery.mapper.ObjectMapper;
import com.springmastery.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final ObjectMapper objectMapper;

    public List<ModuleResponse> getAllModules() {
        log.info("Fetching all modules ordered by display order");
        List<Module> modules = moduleRepository.findAllByOrderByDisplayOrderAsc();
        return objectMapper.toModuleResponseList(modules);
    }

    public ModuleResponse getModuleBySlug(String slug) {
        log.info("Fetching module by slug: {}", slug);
        Module module = moduleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Module", "slug", slug));
        return objectMapper.toResponse(module);
    }
}
