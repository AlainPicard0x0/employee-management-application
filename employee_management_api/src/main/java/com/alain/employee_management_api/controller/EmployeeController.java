package com.alain.employee_management_api.controller;

import com.alain.employee_management_api.entity.Employee;
import com.alain.employee_management_api.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @CrossOrigin
    @GetMapping
    public List<Employee> findEmployees() {
        return employeeService.findAllEmployees();
    }

    @CrossOrigin
    @GetMapping("/{employeeId}")
    public Employee findEmployeeById(@PathVariable("employeeId") Long employeeId) {
        return employeeService.findEmployeeById(employeeId);
    }

    @CrossOrigin
    @PostMapping
    public void addEmployee(@RequestBody Employee employee) {
        employeeService.addEmployee(employee);
    }

    @CrossOrigin
    @DeleteMapping("/{employeeId}")
    public void deleteEmployee(@PathVariable("employeeId") Long employeeId) {
        employeeService.deleteEmployee(employeeId);
    }

    @CrossOrigin
    @PutMapping("/{employeeId}")
    public void updateEmployee(@PathVariable("employeeId") Long employeeId, @RequestParam(required = false) String firstName, @RequestParam(required = false) String lastName, @RequestParam(required = false) String email, @RequestParam(required = false) String password) {
        employeeService.updateEmployee(employeeId, firstName, lastName, email, password);
    }

}
