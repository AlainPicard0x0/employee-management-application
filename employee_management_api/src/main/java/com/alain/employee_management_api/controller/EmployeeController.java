package com.alain.employee_management_api.controller;

import com.alain.employee_management_api.entity.Employee;
import com.alain.employee_management_api.repository.EmployeeRepository;
import com.alain.employee_management_api.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @CrossOrigin
    @GetMapping
    public List<Employee> findEmployees() {
        return employeeService.findAllEmployees();
    }

    @CrossOrigin
    @GetMapping(path = "{employeeId}")
    public Employee findEmployeeById(@PathVariable("employeeId") Long employeeId) {
        return employeeService.findEmployeeById(employeeId);
    }

    @CrossOrigin
    @PostMapping("/login")
    public ResponseEntity<Employee>findUser(@RequestBody UserToUserForm form) {
        Employee user = employeeRepository.findUserByEmail(form.getEmail());
        if(user == null) {
            throw new IllegalStateException("User not found");
        }
        if(Objects.equals(user.getPassword(), form.getPassword())) {
            System.out.println("Password matches: " + user.getPassword() + ":" + form.getPassword());
            Long sickHours = employeeService.getSickHours(user.getEmail());
            ResponseEntity<Employee> emplRes = ResponseEntity.ok(user);
            System.out.println("Employee line 48 " + emplRes);
//            return ResponseEntity.ok().build();
//            return new ResponseEntity<Employee>();
            return ResponseEntity.ok(user);
        }
        else {
            System.out.println("Password incorrect: " + user.getPassword() + ":" + form.getPassword());
            return new ResponseEntity<Employee>(HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @GetMapping("/login")
    public Long getSickHours(@RequestHeader("email") String email) {
        System.out.println(employeeService.getSickHours(email));
        return employeeService.getSickHours(email);
    }

    @CrossOrigin
    @GetMapping("/portal/sick-leave")
    public Long useSickHours(@RequestHeader("email") String email, @RequestHeader("sick-hours") Long sickHours) {
        return employeeService.useSickHours(email, sickHours);
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

class UserToUserForm {
    private String email;
    private String password;

    public UserToUserForm(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public UserToUserForm() {

    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
