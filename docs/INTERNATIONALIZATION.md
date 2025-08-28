# Internationalization System

## Overview

This application implements a comprehensive internationalization system that ensures only well-known English terms remain in the user interface, while all server-generated texts are replaced with codes that are handled on the client side.

## Key Principles

1. **Server Response Codes**: All server responses use descriptive codes instead of human-readable messages
2. **Client-Side Translation**: The frontend is responsible for translating codes to appropriate language messages
3. **Well-Known English Terms**: Only common English terms known by most people remain in the UI
4. **Portuguese Translation**: All user-facing messages are translated to Portuguese

## Architecture

### Server Side
- APIs return response codes like `LOGIN_SUCCESS`, `VALIDATION_EMAIL_INVALID`, etc.
- No human-readable messages are sent from the server
- Consistent error handling across different clients

### Client Side
- Translation maps convert server codes to Portuguese messages
- UI text is managed through translation keys
- Automatic message handling for API responses

## File Structure

```
src/lib/translations/
├── index.ts              # Main translation system
└── api-utils.ts          # API response handling utilities
```

## Translation System

### Server Messages (`serverMessages`)

Maps server response codes to Portuguese translations:

```typescript
export const serverMessages: TranslationMap = {
  // Success codes
  'REQUESTS_RETRIEVED': 'Solicitações LGPD carregadas com sucesso',
  'STATUS_UPDATED': 'Status da solicitação atualizado com sucesso',
  
  // Error codes
  'INSUFFICIENT_PERMISSIONS': 'Permissões insuficientes para esta operação',
  'VALIDATION_EMAIL_INVALID': 'Email inválido',
  
  // Request status translations
  'PENDING': 'Pendente',
  'PROCESSING': 'Em Processamento',
  'COMPLETED': 'Concluída',
  
  // Request type translations
  'ACCESS': 'Acesso aos Dados',
  'DELETION': 'Exclusão de Dados',
};
```

### UI Messages (`uiMessages`)

Maps UI text keys to Portuguese translations (keeping well-known English terms):

```typescript
export const uiMessages: TranslationMap = {
  // Dashboard
  'dashboard_unlock_title': '🔐 Desbloquear Dashboard',
  'dashboard_unlock_button': 'Desbloquear Dashboard',
  
  // Common terms (kept in English as they are well-known)
  'company_dashboard': 'Company Dashboard',
  'key_setup': 'Key Setup',
  'logout': 'Logout',
  'loading': 'Loading',
};
```

## Usage Examples

### Basic Translation

```typescript
import { getServerMessage, getUIMessage } from '@/lib/translations';

// Translate server response code
const message = getServerMessage('LOGIN_SUCCESS');
// Returns: 'Login realizado com sucesso'

// Translate UI text
const buttonText = getUIMessage('dashboard_unlock_button');
// Returns: 'Desbloquear Dashboard'
```

### API Response Handling

```typescript
import { handleAPIResponse } from '@/lib/api-utils';

// Handle API response
const response = await fetch('/api/auth/login');
const data = await response.json();
const { message, data: responseData, isSuccess } = handleAPIResponse(data);

if (isSuccess) {
  setMessage({ type: 'success', text: message });
} else {
  setMessage({ type: 'error', text: message });
}
```

### Component Usage

```typescript
import { getUIMessage, formatRequestType, formatRequestStatus } from '@/lib/translations';

function MyComponent() {
  return (
    <div>
      <h1>{getUIMessage('company_dashboard')}</h1>
      <button>{getUIMessage('dashboard_unlock_button')}</button>
      <span>{formatRequestType('ACCESS')}</span>
      <span>{formatRequestStatus('PENDING')}</span>
    </div>
  );
}
```

## Adding New Translations

### 1. Server Response Codes

Add new codes to `serverMessages` in `src/lib/translations/index.ts`:

```typescript
export const serverMessages: TranslationMap = {
  // ... existing codes
  'NEW_FEATURE_SUCCESS': 'Nova funcionalidade implementada com sucesso',
  'NEW_VALIDATION_ERROR': 'Erro de validação específico',
};
```

### 2. UI Text

Add new UI text keys to `uiMessages`:

```typescript
export const uiMessages: TranslationMap = {
  // ... existing keys
  'new_feature_title': 'Nova Funcionalidade',
  'new_button_text': 'Ação Específica',
};
```

### 3. API Implementation

Update your API route to return codes:

```typescript
// In your API route
return NextResponse.json(
  { code: 'NEW_FEATURE_SUCCESS', data: { result: 'success' } },
  { status: 200 }
);
```

## Benefits

1. **Language Agnostic Backend**: Server APIs are language-independent
2. **Consistent Error Handling**: Same error codes across all clients
3. **Easy Localization**: Simple to add new languages by extending translation maps
4. **Better Separation of Concerns**: UI logic separated from business logic
5. **Maintainable**: Centralized translation management

## Best Practices

1. **Use Descriptive Codes**: Make server codes self-explanatory
2. **Keep English Terms**: Only use English for well-known technical terms
3. **Consistent Naming**: Use consistent patterns for translation keys
4. **Documentation**: Always document new codes and their meanings
5. **Testing**: Test translations in different contexts

## Migration Guide

When migrating existing code:

1. Replace hardcoded Portuguese text with translation keys
2. Update API responses to use codes instead of messages
3. Use `getUIMessage()` for UI text
4. Use `getServerMessage()` for server responses
5. Use `handleAPIResponse()` for automatic API response handling

## Example Migration

### Before
```typescript
// API
return NextResponse.json({ message: 'Login realizado com sucesso' });

// Component
<button>Desbloquear Dashboard</button>
```

### After
```typescript
// API
return NextResponse.json({ code: 'LOGIN_SUCCESS' });

// Component
<button>{getUIMessage('dashboard_unlock_button')}</button>
```
