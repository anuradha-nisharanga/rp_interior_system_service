package com.bit.rp_interior_system.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity)throws Exception{
        httpSecurity.authorizeHttpRequests(auth -> {
                    auth
                            .requestMatchers("/resource/**").permitAll()
                            .requestMatchers("/create-admin").permitAll()
                            .requestMatchers("/login").permitAll()
                            .requestMatchers("/error").permitAll()
                            .requestMatchers("/index").permitAll()
                            .requestMatchers("/dashboard").hasAnyAuthority("Admin","Manager")
                            .requestMatchers("/index").hasAnyAuthority("Admin","Manager","Production Manager","Store Manager","Finance Manager")
                            .requestMatchers("/employee/**").hasAnyAuthority("Admin","Manager")
                            .requestMatchers("/user/**").hasAnyAuthority("Admin")
                            .requestMatchers("/privilege/**").hasAnyAuthority("Admin","Manager","Production Manager")
                            .requestMatchers("/material/**").hasAnyAuthority("Admin","Manager","StoreKeeper")
                            .requestMatchers("/customer/**").hasAnyAuthority("Admin","Manager")
                            .anyRequest().authenticated();

                })
                //login form detailed
                .formLogin(login -> {
                    login.loginPage("/login")
                            .defaultSuccessUrl("/privilege/ui",true)
                            .failureUrl("/login?error=usernamepassworderror")
                            .usernameParameter("username")
                            .passwordParameter("password");
                })

                //logout
                .logout (logout ->{
                    logout
                            .logoutUrl("/logout")
                            .logoutSuccessUrl("/login");
                })

                //exception
                .exceptionHandling(exception ->{
                    exception.accessDeniedPage("/error");
                })

                //request url without in chrome like js
                .csrf(csrf ->{
                    csrf.disable();
                });

        return  httpSecurity.build();
    }
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
}
