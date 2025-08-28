Feature: Secure Data Protection
  As a data subject
  I want my LGPD requests to be handled securely
  So that my personal information remains private during the process

  Background:
    Given the LGPD platform is running for company "TechCorp Ltd"
    And I am logged in as a data subject "subject@example.com"
    And security features are properly configured

  Scenario: Request security confirmation during submission
    Given I am on the LGPD requests page
    When I select "Solicitação de Acesso a Dados"
    And I fill in sensitive information:
      | field       | value                                    |
      | reason      | Quero ver dados sobre meu histórico médico |
      | description | Por favor, forneça informações sobre meus registros de saúde de 2023 |
    And I click "Enviar Solicitação"
    Then I should see "Sua solicitação está sendo protegida"
    And I should see "✓ Dados protegidos com segurança"
    And I should see "Suas informações pessoais estão seguras"

  Scenario: Successful security processing before PIX payment
    Given I am submitting a data deletion request with sensitive details
    When the system processes my request securely
    Then I should see "✓ Solicitação protegida com sucesso"
    And I should see "✓ Pronto para verificação de identidade"
    And I should be able to proceed to PIX payment

  Scenario: Security processing failure handling
    Given I am submitting a data access request
    When the security processing fails
    Then I should see "❌ Falha na proteção dos dados - solicitação não enviada"
    And I should see "Tente novamente ou entre em contato com o suporte"
    And my request should not be stored in the system
    And I should not proceed to PIX payment

  Scenario: Company employee can access and process request
    Given I have submitted a secure LGPD request
    And a company representative is logged in to the dashboard
    When they view pending requests
    Then they should see my request listed with:
      | field       | value                    |
      | ID da Solicitação  | [generated-id]       |
      | Tipo        | Acesso a Dados           |
      | Status      | Pendente                 |
      | Enviado     | [timestamp]              |
    When they click "Ver Detalhes"
    And they authenticate with company credentials
    Then they should see the request content
    And they should be able to process the LGPD request

  Scenario: Privacy assurance for user
    Given I have submitted a secure LGPD request
    When I view my request status
    Then I should see "Sua solicitação está protegida"
    And I should see "Apenas funcionários autorizados da empresa podem ver sua solicitação"
    And I should see "Suas informações pessoais estão seguras"

  Scenario: Browser compatibility check
    Given I am using a modern web browser
    When I access the LGPD requests page
    Then the system should verify security capabilities
    And I should see "✓ Seu navegador é compatível"
    When I use an incompatible browser
    Then I should see "❌ Seu navegador precisa ser atualizado"
    And I should see "Use uma versão mais recente do Chrome, Firefox ou Safari"

  Scenario: Privacy confirmation
    Given I am viewing my submitted request
    Then I should see "🔒 Suas informações estão protegidas"
    And I should see "Apenas você e a empresa podem ver os detalhes desta solicitação"