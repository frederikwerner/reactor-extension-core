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

import { mount } from 'enzyme';
import Radio from '@coralui/react-coral/lib/Radio';
import extensionViewReduxForm from '../../../extensionViewReduxForm';
import ElementFilter, { formConfig } from '../elementFilter';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import SpecificElements from '../specificElements';

const getReactComponents = (wrapper) => {
  const radios = wrapper.find(Radio);

  const specificElementsRadio = radios.filterWhere(n => n.prop('value') === 'specific').node;
  const anyElementRadio = radios.filterWhere(n => n.prop('value') === 'any').node;
  const specificElements = wrapper.find(SpecificElements).node;

  return {
    specificElementsRadio,
    specificElements,
    anyElementRadio
  };
};

describe('elementFilter', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(ElementFilter);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('updates view properly when elementSelector is provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    const { specificElementsRadio, specificElements } = getReactComponents(instance);

    expect(specificElementsRadio.props.checked).toBe(true);
    expect(specificElements).toBeDefined();
  });

  it('updates view properly when elementSelector is not provided', () => {
    extensionBridge.init({ settings: {} });

    const { anyElementRadio, specificElements } = getReactComponents(instance);

    expect(anyElementRadio.props.checked).toBe(true);
    expect(specificElements).not.toBeDefined();
  });

  it('removes elementSelector and elementProperties from settings if any ' +
    'element radio is selected', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          }
        ]
      }
    });

    const { anyElementRadio } = getReactComponents(instance);

    anyElementRadio.props.onChange(anyElementRadio.props.value);

    const { elementSelector, elementProperties } = extensionBridge.getSettings();

    expect(elementSelector).toBeUndefined();
    expect(elementProperties).toBeUndefined();
  });

  it('includes specificElements errors if specific element radio is selected', () => {
    extensionBridge.init();

    const { specificElementsRadio } = getReactComponents(instance);

    specificElementsRadio.props.onChange(specificElementsRadio.props.value);

    expect(extensionBridge.validate()).toBe(false);
  });

  it('excludes specificElements errors if any element radio is selected', () => {
    extensionBridge.init();

    const { anyElementRadio } = getReactComponents(instance);

    anyElementRadio.props.onChange(anyElementRadio.props.value);

    expect(extensionBridge.validate()).toBe(true);
  });
});
