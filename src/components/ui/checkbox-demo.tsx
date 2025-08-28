import React, { useState } from 'react';
import { Checkbox } from './checkbox';

type CheckedState = boolean | "indeterminate";

export function CheckboxDemo() {
  const [checked1, setChecked1] = useState<CheckedState>(false);
  const [checked2, setChecked2] = useState<CheckedState>(true);
  const [checked3, setChecked3] = useState<CheckedState>(false);
  const [checked4, setChecked4] = useState<CheckedState>(false);
  const [checked5, setChecked5] = useState<CheckedState>("indeterminate"); // Used in indeterminate checkbox

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Checkbox Component Demo</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Checkbox</h3>
          <Checkbox
            id="basic-checkbox"
            checked={checked1}
            onCheckedChange={setChecked1}
            aria-label="Basic checkbox"
          />
          <p className="text-sm text-gray-600 mt-1">
            State: {checked1 ? 'Checked' : 'Unchecked'}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Checkbox with Label</h3>
          <Checkbox
            id="labeled-checkbox"
            checked={checked2}
            onCheckedChange={setChecked2}
            label="Accept terms and conditions"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Required Checkbox</h3>
          <Checkbox
            id="required-checkbox"
            checked={checked3}
            onCheckedChange={setChecked3}
            label="I agree to the privacy policy"
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Disabled Checkbox</h3>
          <Checkbox
            id="disabled-checkbox"
            checked={checked4}
            onCheckedChange={setChecked4}
            label="This option is disabled"
            disabled
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Indeterminate Checkbox</h3>
          <Checkbox
            id="indeterminate-checkbox"
            checked={checked5}
            onCheckedChange={setChecked5}
            label="Select all items"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Form Integration Example</h3>
          <form className="space-y-3">
            <Checkbox
              id="form-checkbox-1"
              name="newsletter"
              checked={checked1}
              onCheckedChange={setChecked1}
              label="Subscribe to newsletter"
            />
            <Checkbox
              id="form-checkbox-2"
              name="marketing"
              checked={checked2}
              onCheckedChange={setChecked2}
              label="Receive marketing emails"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
