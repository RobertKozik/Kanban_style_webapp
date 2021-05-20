package live.rkozik.pm_app.backend.services;

import live.rkozik.pm_app.backend.dtos.ProjectDto;
import live.rkozik.pm_app.backend.mappers.ProjectMapper;
import live.rkozik.pm_app.backend.models.Project;
import live.rkozik.pm_app.backend.repositories.ProjectRepository;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    final private ProjectRepository repository;
    final private ProjectMapper mapper;

    @Autowired
    public ProjectService(ProjectRepository repository, ProjectMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<ProjectDto> findAllProjectsByUserId(Long id) {

        List<Project> projects = repository.findByIdUser(id);
        return projects.stream()
                .map(mapper::ProjectToProjectDto)
                .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id) {
        Optional<Project> OptionalProject = repository.findById(id);

        return OptionalProject.map(mapper::ProjectToProjectDto).orElseThrow(
                () -> new HttpClientErrorException(HttpStatus.NOT_FOUND, "cannot find project")
        );
    }

    public ProjectDto dispatchProject(ProjectDto project) throws IllegalArgumentException {
        //TODO get user (who requested it) and add him as participant
        if(project.getId() != null)
            throw new HttpClientErrorException(HttpStatus.CONFLICT, "id cannot be given");

        Project mappedProject = mapper.ProjectDtoToProject(project);

        return mapper.ProjectToProjectDto( repository.saveAndFlush(mappedProject) );
    }

    public ProjectDto updateProject(ProjectDto project) {
        if(project.getId() == null || !repository.existsById(project.getId()))
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND,"id doesn't exists");

        Project mappedProject = mapper.ProjectDtoToProject(project);

        return mapper.ProjectToProjectDto( repository.saveAndFlush(mappedProject) );
    }

    public boolean deleteProject(ProjectDto project) {
        try {
            repository.deleteById(project.getId());
        } catch (IllegalArgumentException exception) {

            throw new HttpClientErrorException(HttpStatus.I_AM_A_TEAPOT, "id cannot be null");
        }

        return true;
    }

}
