package com.alain.employee_management_api.entity;

import javax.persistence.*;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(
            strategy = GenerationType.AUTO
    )
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

//    @Column(columnDefinition = "bigint default 16")
    @Column(name = "sick_leave")
    private Long sickLeave;

    public Employee(Long id, String firstName, String lastName, String email, String password, Long sickLeave) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.sickLeave = 16L;
        System.out.println("Constructor 1 ran");
        System.out.println("Constructor 1: " + this.getSickLeave());
    }

    public Employee(String firstName, String lastName, String email, String password, Long sickLeave) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.sickLeave = 16L;
        System.out.println("Constructor 2 ran");
        System.out.println("Constructor 2: " + this.getSickLeave());
    }

    public Employee() {
        System.out.println("Constructor 3 ran");
        System.out.println("Constructor 3: " + this.getSickLeave());
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
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

    public Long getSickLeave() {
        return sickLeave;
    }
    public void setSickLeave(Long sickLeave) {
        this.sickLeave = sickLeave;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id: " + id +
                ", firstName: '" + firstName + '\'' +
                ", lastName: '" + lastName + '\'' +
                ", email: '" + email + '\'' +
                ", password: '" + password + '\'' +
                ", sickLeave: " + sickLeave +
                '}';
    }
}
