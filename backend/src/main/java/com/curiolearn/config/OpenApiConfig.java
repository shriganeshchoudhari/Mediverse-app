package com.curiolearn.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI mediverseOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Mediverse | 3D Medical Physiology & Clinical Simulation Platform API")
                        .description("REST & Real-Time SSE API documentation for Mediverse — Next-Generation Medical Educational Platform covering undergraduate CBME, postgraduate residency packs, biophysical solvers, exams, and Socratic AI tutoring.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Mediverse Engineering Team")
                                .email("engineering@mediverse.edu")
                                .url("https://mediverse.edu"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .servers(List.of(
                        new Server().url("http://localhost:8085").description("Local Development Server"),
                        new Server().url("https://api.mediverse.edu").description("Production Cloud Cluster")
                ))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT Bearer token obtained from POST /api/v1/auth/login")));
    }
}
