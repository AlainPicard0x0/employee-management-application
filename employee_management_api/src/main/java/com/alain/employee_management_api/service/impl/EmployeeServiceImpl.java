package com.alain.employee_management_api.service.impl;

import com.alain.employee_management_api.entity.Employee;
import com.alain.employee_management_api.repository.EmployeeRepository;
import com.alain.employee_management_api.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<Employee> findAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee findEmployeeById(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new IllegalStateException("Employee not found"));
    }

    @Override
    public void addEmployee(Employee employee) {
        Optional<Employee> employeeOptional = employeeRepository.findEmployeeByEmail(employee.getEmail());
        if(employeeOptional.isPresent()) {
            throw new IllegalStateException("Email already in use. Please use a different email");
        }
        employeeRepository.save(employee);
    }


    @Transactional
    public void updateEmployee(Long id, String firstName, String lastName, String email, String password) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new IllegalStateException("Employee Not Found"));
        if(firstName != null && !Objects.equals(employee.getFirstName(), firstName)) {
            employee.setFirstName(firstName);
            System.out.println("Employee First Name updated to: " + firstName);
        }
        if(lastName != null && !Objects.equals(employee.getLastName(), lastName)) {
            employee.setLastName(lastName);
            System.out.println("Employee Last Name updated to: " + lastName);
        }
        if(email != null && !Objects.equals(employee.getEmail(), email)) {
            Optional<Employee> employeeOptional = employeeRepository.findEmployeeByEmail(email);
            if(employeeOptional.isPresent()) {
                throw new IllegalStateException("Email already in use");
            }
            employee.setEmail(email);
            System.out.println("Employee Email updated to: " + email);
        }
        if(password != null && !Objects.equals(employee.getPassword(), password)) {
            employee.setPassword(password);
            System.out.println("Employee Password updated");
        }
    }

    @Override
    public void deleteEmployee(Long id) {
        boolean exists = employeeRepository.existsById(id);
        if(!exists) {
            throw new IllegalStateException("Employee Not Found");
        }
        employeeRepository.deleteById(id);
    }
}
