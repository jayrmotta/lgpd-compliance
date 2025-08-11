Feature: User Authentication
  As a data subject or company representative
  I want to access the LGPD compliance platform
  So that I can manage LGPD requests securely

  Background:
    Given the LGPD platform is running
    And the database is clean

  Scenario: User registration with new email
    Given I am on the registration page
    When I fill in the registration form with:
      | field    | value                    |
      | email    | user@example.com         |
      | password | SecurePassword123!       |
      | userType | data_subject            |
    And I submit the registration form
    Then I should see a success message "Cadastro realizado com sucesso"
    And I should be redirected to the login page

  Scenario: User registration with existing email (security-safe response)
    Given a user already exists with email "existing@example.com"
    And I am on the registration page
    When I fill in the registration form with:
      | field    | value                |
      | email    | existing@example.com |
      | password | AnotherPassword123!  |
      | userType | data_subject         |
    And I submit the registration form
    Then I should see a success message "Cadastro realizado com sucesso"
    And I should be redirected to the login page
    # Note: System sends email to existing address with "Account already exists" message
    # This prevents email enumeration while informing legitimate users

  Scenario: User login with valid credentials
    Given a user exists with email "user@example.com" and password "SecurePassword123!"
    And I am on the login page
    When I fill in the login form with:
      | field    | value            |
      | email    | user@example.com |
      | password | SecurePassword123! |
    And I submit the login form
    Then I should be logged in successfully
    And I should see the dashboard page
    And I should see "Bem-vindo" message

  Scenario: User login with invalid credentials
    Given I am on the login page
    When I fill in the login form with:
      | field    | value                |
      | email    | wrong@example.com    |
      | password | WrongPassword123!    |
    And I submit the login form
    Then I should see an error message "Email ou senha incorretos"
    And I should remain on the login page
    # Note: Generic error message prevents email enumeration

  Scenario: User login with valid email but wrong password
    Given a user exists with email "user@example.com" and password "CorrectPassword123!"
    And I am on the login page
    When I fill in the login form with:
      | field    | value            |
      | email    | user@example.com |
      | password | WrongPassword123! |
    And I submit the login form
    Then I should see an error message "Email ou senha incorretos"
    And I should remain on the login page
    # Note: Same generic error message as non-existent email

  Scenario: Password validation during registration
    Given I am on the registration page
    When I fill in the registration form with:
      | field    | value         |
      | email    | user@test.com |
      | password | weak          |
      | userType | data_subject  |
    And I submit the registration form
    Then I should see an error message "A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e caractere especial"
    And I should remain on the registration page

  Scenario: Session persistence
    Given I am logged in as "user@example.com"
    When I refresh the page
    Then I should still be logged in
    And I should see the dashboard page

  Scenario: User logout
    Given I am logged in as "user@example.com"
    And I am on the dashboard page
    When I click the logout button
    Then I should be logged out
    And I should be redirected to the login page
    And I should not have access to protected pages

  Scenario: Password reset request (security-safe)
    Given I am on the login page
    When I click "Esqueci minha senha"
    And I enter email "any@example.com"
    And I submit the password reset request
    Then I should see a message "Se este email existe em nosso sistema, você receberá instruções para redefinir sua senha"
    # Note: Generic message prevents email enumeration