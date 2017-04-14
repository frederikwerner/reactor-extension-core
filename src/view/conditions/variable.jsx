/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import React from 'react';
import Icon from '@coralui/react-coral/lib/Icon';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Tooltip from '@coralui/react-coral/lib/Tooltip';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';


const Variable = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">JS Variable Name</span>
      <Field
        name="name"
        component={ DecoratedInput }
        inputComponent={ Textfield }
      />
    </label>
    <label className="u-gapRight">
      <span className="u-label">JS Variable Value</span>
      <Field
        name="value"
        component={ DecoratedInput }
        inputComponent={ Textfield }
      />
    </label>
    <Tooltip
      className="u-tooltipMaxWidth"
      openOn="hover"
      content="Specify a text (string) value here. The rule will only fire if the specified
      variable contains this string. Note: If your variable contains a number, this will not
      work as expected."
    >
      <Icon icon="infoCircle" size="XS" className="u-inline-tooltip u-gapRight" />
    </Tooltip>
    <Field
      name="valueIsRegex"
      component={ RegexToggle }
      valueFieldName="value"
    />
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a variable name.';
    }

    if (!values.value) {
      errors.value = 'Please specify a variable value.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Variable);
