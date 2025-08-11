Feature: LGPD Request Submission
  As a data subject
  I want to submit LGPD requests with PIX authentication
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
    Then I should see a PIX QR code for "R$ 0.01"
    And I should see instructions "Pague R$ 0,01 para verificar sua identidade"
    When I complete the PIX payment with CPF "123.456.789-00"
    Then I should see "Pagamento verificado com sucesso"
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
    Then I should see a PIX QR code for "R$ 0.01"
    When I complete the PIX payment with CPF "123.456.789-00"
    Then I should see "Pagamento verificado com sucesso"
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
    Then I should see a PIX QR code for "R$ 0.01"
    When I complete the PIX payment with CPF "123.456.789-00"
    Then I should see "Pagamento verificado com sucesso"
    And I should see "Sua solicitação de correção foi enviada com segurança"
    And my request should appear in "My Requests" with status "Pending"

  Scenario: PIX payment timeout
    Given I am submitting a data access request
    And I have reached the PIX payment step
    When I do not complete the payment within 15 minutes
    Then I should see "Payment verification timed out"
    And I should see "Please start a new request"
    And the request should not be submitted

  Scenario: PIX payment with wrong CPF
    Given I am submitting a data access request
    And I have reached the PIX payment step
    When I complete the PIX payment with CPF "000.000.000-00"
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

  Scenario: Mock PIX payment for development
    Given the system is in development mode
    And I am submitting a data access request
    When I reach the PIX payment step
    Then I should see a "Mock Payment" button
    When I click "Mock Payment"
    And I enter CPF "123.456.789-00"
    Then I should see "Mock payment verified successfully"
    And my request should be submitted normally

  Scenario: Request confirmation shows encryption notice
    Given I have filled out a data access request
    And I have completed PIX verification
    When my request is being submitted
    Then I should see "Your request is being encrypted before submission"
    And I should see "The company will only see encrypted data until they process your request"
    And I should see "Request submitted successfully with ID: REQ-"