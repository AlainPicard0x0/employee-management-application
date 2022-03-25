package com.alain.employee_management_api.service;

import com.alain.employee_management_api.entity.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    List<Employee> findAllEmployees();

    Employee findEmployeeById(Long id);

    void addEmployee(Employee employee);

    void updateEmployee(Long id, String firstName, String lastName, String email, String password);

    void deleteEmployee(Long id);
}
