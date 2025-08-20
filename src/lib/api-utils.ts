import { getServerMessage } from './translations';

export interface APIResponse {
  code: string;
  message?: string;
  data?: unknown;
}

/**
 * Handles API responses and automatically translates server codes to user-friendly messages
 * @param response - The API response object
 * @returns Object with translated message and data
 */
export function handleAPIResponse(response: APIResponse): {
  message: string;
  data?: unknown;
  isSuccess: boolean;
} {
  // Get the translated message for the server code
  const translatedMessage = getServerMessage(response.code);
  
  // Determine if it's a success response based on the code
  const isSuccess = response.code.includes('SUCCESS') || 
                   response.code.includes('RETRIEVED') || 
                   response.code.includes('UPDATED') ||
                   response.code.includes('CREATED');
  
  return {
    message: translatedMessage,
    data: response.data,
    isSuccess
  };
}

/**
 * Example usage in a component:
 * 
 * const response = await fetch('/api/some-endpoint');
 * const data = await response.json();
 * const { message, data: responseData, isSuccess } = handleAPIResponse(data);
 * 
 * if (isSuccess) {
 *   setMessage({ type: 'success', text: message });
 * } else {
 *   setMessage({ type: 'error', text: message });
 * }
 */
