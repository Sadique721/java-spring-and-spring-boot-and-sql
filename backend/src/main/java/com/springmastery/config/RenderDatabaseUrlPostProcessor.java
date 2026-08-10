package com.springmastery.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * EnvironmentPostProcessor — runs BEFORE any beans are created.
 *
 * Render provides PostgreSQL connection as:
 *   postgres://user:pass@host:port/dbname
 *
 * Spring Boot JDBC needs:
 *   jdbc:postgresql://host:port/dbname?user=user&password=pass
 *
 * This processor converts the URL format at the earliest possible moment.
 */
public class RenderDatabaseUrlPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment,
                                       SpringApplication application) {

        String url = environment.getProperty("spring.datasource.url", "");

        if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
            String jdbcUrl = convertToJdbcUrl(url);

            Map<String, Object> props = new LinkedHashMap<>();
            props.put("spring.datasource.url", jdbcUrl);

            environment.getPropertySources().addFirst(
                new MapPropertySource("renderJdbcUrlFix", props)
            );

            System.out.println("[RenderFix] Datasource URL converted to JDBC format.");
        }
    }

    /**
     * Converts postgres://user:pass@host:port/dbname
     *     to jdbc:postgresql://host:port/dbname
     *
     * Username and password are kept in separate spring.datasource properties.
     */
    private String convertToJdbcUrl(String postgresUrl) {
        // Strip scheme
        String stripped = postgresUrl
            .replaceFirst("^postgres://", "")
            .replaceFirst("^postgresql://", "");

        // Remove user:pass@ prefix if present (they are set separately)
        int atIndex = stripped.indexOf('@');
        if (atIndex >= 0) {
            stripped = stripped.substring(atIndex + 1);
        }

        return "jdbc:postgresql://" + stripped;
    }
}
