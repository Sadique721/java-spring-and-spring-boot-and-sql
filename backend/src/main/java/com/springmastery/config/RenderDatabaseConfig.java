package com.springmastery.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Converts Render's postgres:// URL format to jdbc:postgresql:// format.
 *
 * Render provides the DATABASE_URL as:
 *   postgres://user:pass@host:port/dbname
 *
 * Spring JDBC needs:
 *   jdbc:postgresql://host:port/dbname
 */
@Configuration
@Profile("render")
public class RenderDatabaseConfig {

    private final ConfigurableEnvironment environment;

    public RenderDatabaseConfig(ConfigurableEnvironment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void fixDatabaseUrl() {
        String url = environment.getProperty("spring.datasource.url", "");

        // If Render provides postgres:// format, convert it
        if (url.startsWith("postgres://")) {
            String jdbcUrl = url
                .replace("postgres://", "jdbc:postgresql://")
                .replace("postgresql://", "jdbc:postgresql://");

            // Override in environment
            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", jdbcUrl);
            environment.getPropertySources().addFirst(
                new MapPropertySource("renderDbFix", props)
            );

            System.out.println("[Render] Converted DB URL to JDBC format: " +
                jdbcUrl.replaceAll(":[^@]+@", ":***@")); // mask password in logs
        }
    }
}
