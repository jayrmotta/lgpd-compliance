Feature: LGPD Request Submission
  As a data subject
  I want to submit LGPD requests with identity verification
  So that I can exercise my privacy rights with the company operating this platform

  Background:
    Given the LGPD platform is running for company "TechCorp Ltd"
    And I am logged in as a data subject "subject@example.com"

  Scenario: Submit data access request with PIX authentication
    Given I am on the LGPD requests page
    When I select "Solicitação de Acesso a Dados"
    And I fill in the request details:
      | field       | value                                    |
      | reason      | I want to see what personal data you have |
      | description | Please provide all my personal information |
    And I click "Enviar Solicitação"
    Then I should see identity verification section
    And I should see instructions "Insira seu CPF para verificar sua identidade"
    When I enter CPF "123.456.789-00" and verify identity
    Then I should see "Identidade verificada com sucesso"
    And I should see "Sua solicitação foi enviada com segurança"
    And my request should appear in "My Requests" with status "Pending"

  Scenario: Submit data deletion request with PIX authentication
    Given I am on the LGPD requests page
    When I select "Solicitação de Exclusão de Dados"
    And I fill in the request details:
      | field       | value                           |
      | reason      | I no longer want to use the service |
      | description | Please delete all my data completely |
    And I click "Enviar Solicitação"
    Then I should see identity verification section
    When I enter CPF "123.456.789-00" and verify identity
    Then I should see "Identidade verificada com sucesso"
    And I should see "Sua solicitação de exclusão foi enviada com segurança"
    And my request should appear in "My Requests" with status "Pending"

  Scenario: Submit data correction request with PIX authentication
    Given I am on the LGPD requests page
    When I select "Solicitação de Correção de Dados"
    And I fill in the request details:
      | field       | value                                  |
      | reason      | My address information is incorrect     |
      | description | Please update my address to: New Street, 123 |
    And I click "Enviar Solicitação"
    Then I should see identity verification section
    When I enter CPF "123.456.789-00" and verify identity
    Then I should see "Identidade verificada com sucesso"
    And I should see "Sua solicitação de correção foi enviada com segurança"
    And my request should appear in "My Requests" with status "Pending"

  Scenario: Identity verification with wrong CPF
    Given I am submitting a data access request
    And I have reached the identity verification step
    When I enter CPF "000.000.000-00" and verify identity
    Then I should see "CPF verification failed"
    And I should see "Please ensure you're using the same CPF associated with your account"
    And the request should not be submitted

  Scenario: View submitted requests history
    Given I have previously submitted requests:
      | type       | status     | submitted_at | response_due |
      | Access     | Pending    | 2 days ago   | in 13 days   |
      | Deletion   | Processing | 1 week ago   | in 8 days    |
      | Correction | Completed  | 1 month ago  | completed    |
    When I go to "My Requests" page
    Then I should see my requests listed:
      | type       | status     | submitted    | response_due |
      | Access     | Pending    | 2 days ago   | in 13 days   |
      | Deletion   | Processing | 1 week ago   | in 8 days    |
      | Correction | Completed  | 1 month ago  | completed    |

  Scenario: Cannot submit request without being logged in
    Given I am not logged in
    When I try to access the LGPD requests page
    Then I should be redirected to the login page
    And I should see "Please log in to submit LGPD requests"

  Scenario: Request type selection
    Given I am on the LGPD requests page
    Then I should see available request types:
      | type                    | description                           |
      | Data Access Request     | View what personal data we have       |
      | Data Deletion Request   | Delete all your personal data         |
      | Data Correction Request | Correct inaccurate personal data      |
      | Data Portability Request| Export your data in a portable format |

  Scenario: Mock identity verification for development
    Given the system is in development mode
    And I am submitting a data access request
    When I reach the identity verification step
    Then I should see a "Mock Verification" button
    When I click "Mock Verification"
    And I enter CPF "123.456.789-00"
    Then I should see "Mock verification successful"
    And my request should be submitted normally

  Scenario: Request confirmation shows encryption notice
    Given I have filled out a data access request
    And I have completed identity verification
    When my request is being submitted
    Then I should see "Your request is being encrypted before submission"
    And I should see "The company will only see encrypted data until they process your request"
    And I should see "Request submitted successfully with ID: REQ-"