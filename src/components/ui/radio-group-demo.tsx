import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './radio-group';

export function RadioGroupDemo() {
  const [selectedValue, setSelectedValue] = useState('option1');
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const userTypes = [
    { value: 'data_subject', label: 'Data Subject' },
    { value: 'company_representative', label: 'Company Representative' },
    { value: 'admin', label: 'Administrator' },
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Radio Group Component Demo</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Radio Group</h3>
          <RadioGroup
            options={options}
            value={selectedValue}
            onValueChange={setSelectedValue}
            name="basic-radio"
          />
          <p className="text-sm text-gray-600 mt-2">
            Selected: {selectedValue}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Orientation Control</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Orientation:</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as 'vertical' | 'horizontal')}
              className="border rounded px-2 py-1"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <RadioGroup
            options={options}
            orientation={orientation}
            name="orientation-radio"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Required Radio Group</h3>
          <RadioGroup
            options={userTypes}
            name="user-type"
            required
          />
          <p className="text-sm text-gray-600 mt-2">
            This radio group is required for form validation
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Disabled Radio Group</h3>
          <RadioGroup
            options={options}
            disabled
            name="disabled-radio"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Individual Radio Items</h3>
          <RadioGroup name="individual-radio" defaultValue="item1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="item1" id="item1" />
              <label htmlFor="item1" className="text-sm font-medium">
                Custom Item 1
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="item2" id="item2" />
              <label htmlFor="item2" className="text-sm font-medium">
                Custom Item 2
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="item3" id="item3" />
              <label htmlFor="item3" className="text-sm font-medium">
                Custom Item 3
              </label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Form Integration Example</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">User Type:</label>
              <RadioGroup
                options={userTypes}
                name="form-user-type"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Notification Preferences:</label>
              <RadioGroup
                options={[
                  { value: 'email', label: 'Email notifications' },
                  { value: 'sms', label: 'SMS notifications' },
                  { value: 'none', label: 'No notifications' },
                ]}
                name="form-notifications"
              />
            </div>
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
