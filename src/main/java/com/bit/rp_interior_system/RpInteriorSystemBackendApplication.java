package com.bit.rp_interior_system;

import com.bit.rp_interior_system.model.Role;
import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.repository.EmployeeRepository;
import com.bit.rp_interior_system.repository.RoleRepository;
import com.bit.rp_interior_system.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
@Slf4j
@SpringBootApplication
@RestController
public class RpInteriorSystemBackendApplication {

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRepository userRepository;

	public static void main(String[] args) {
		SpringApplication.run(RpInteriorSystemBackendApplication.class, args);
		System.out.println("Project Started");
	}

	@GetMapping(value = "/create-admin")
	public String generateAdmin(){
		log.info("Create Super Admin");
		User adminUser = new User();
		adminUser.setUsername("Admin");
		adminUser.setPassword(bCryptPasswordEncoder.encode("1234"));
		adminUser.setEmail("admin@gmail.com");
		adminUser.setStatus(true);
		adminUser.setCreatedDate(LocalDateTime.now());
		adminUser.setEmployee(employeeRepository.getReferenceById(1));

		Set<Role> roles = new HashSet<Role>();
		roles.add(roleRepository.getReferenceById(1));

		adminUser.setRoles(roles);

		userRepository.save(adminUser);

		return "<script>window.location.replace('http://localhost:8080/login')</script>";
	}

}
