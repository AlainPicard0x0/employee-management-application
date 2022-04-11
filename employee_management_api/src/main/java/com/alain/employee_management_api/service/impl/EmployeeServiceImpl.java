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
    public Employee authenticateEmployee(String email, String password) {
        Employee user = employeeRepository.findUserByEmail(email);
        if(user == null) {
            System.out.println("User not Found: null");
        }
        else {
            System.out.println("User found in database: " + user);
        }
        return user;
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

    @Override
    public Long getSickHours(String email) {
        Employee employee = employeeRepository.findUserByEmail(email);
        if(employee == null) {
            throw new IllegalStateException("Employee not found");
        }
        return employee.getSickLeave();
    }

    @Override
    @Transactional
    public Long useSickHours(String email, Long sickHoursUsed) {
        Employee employee = employeeRepository.findUserByEmail(email);
        if(employee == null) {
            throw new IllegalStateException("Employee not found");
        }
        Long sickLeaveRemaining = employee.getSickLeave() - sickHoursUsed;
        employee.setSickLeave(sickLeaveRemaining);
        return employee.getSickLeave();
    }

    @Override
    public Long getVacationHours(String email) {
        Employee employee = employeeRepository.findUserByEmail(email);
        if(employee == null) {
            throw new IllegalStateException("Employee not found");
        }
        return employee.getVacationLeave();
    }

    @Override
    @Transactional
    public Long useVacationHours(String email, Long vacationHoursUsed) {
        Employee employee = employeeRepository.findUserByEmail(email);
        if(employee == null) {
            throw new IllegalStateException("Employee not found");
        }
        Long vacationHoursRemaining = employee.getVacationLeave() - vacationHoursUsed;
        employee.setVacationLeave(vacationHoursRemaining);
        return employee.getVacationLeave();
    }
}
