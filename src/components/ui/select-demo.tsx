import React, { useState } from 'react';
import { EnhancedSelect } from './select';

const userTypeOptions = [
  { value: 'data_subject', label: 'Titular dos Dados' },
  { value: 'company_representative', label: 'Representante da Empresa' },
  { value: 'admin', label: 'Administrador' },
];

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'rejected', label: 'Rejeitado' },
  { value: 'completed', label: 'Concluído' },
];

export function SelectDemo() {
  const [userType, setUserType] = useState<string>('');
  const [status, setStatus] = useState<string>('pending');

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Component Examples</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Usuário</label>
            <EnhancedSelect
              options={userTypeOptions}
              placeholder="Selecione o tipo de usuário"
              value={userType}
              onValueChange={setUserType}
              className="w-full max-w-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status da Solicitação</label>
            <EnhancedSelect
              options={statusOptions}
              placeholder="Selecione o status"
              value={status}
              onValueChange={setStatus}
              className="w-full max-w-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Desabilitado</label>
            <EnhancedSelect
              options={userTypeOptions}
              placeholder="Select desabilitado"
              disabled
              className="w-full max-w-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Pequeno</label>
            <EnhancedSelect
              options={userTypeOptions}
              placeholder="Select pequeno"
              size="sm"
              className="w-full max-w-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Grande</label>
            <EnhancedSelect
              options={userTypeOptions}
              placeholder="Select grande"
              size="lg"
              className="w-full max-w-xs"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h4 className="font-medium mb-2">Valores Selecionados:</h4>
          <p>Tipo de Usuário: {userType || 'Nenhum selecionado'}</p>
          <p>Status: {status}</p>
        </div>
      </div>
    </div>
  );
}
