import React from 'react';
import Coral from '../../reduxFormCoralUI';
import ElementSelectorField, {
  fields as elementSelectorFieldFields
} from './elementSelectorField';
import ElementPropertiesEditor, {
  fields as elementPropertiesEditorFields,
  reducers as elementPropertiesEditorReducers
} from './elementPropertiesEditor';
import reduceReducers from 'reduce-reducers';

export const fields = [
  'showSpecificElementsFilter',
  'showElementPropertiesFilter'
]
.concat(elementSelectorFieldFields)
.concat(elementPropertiesEditorFields);

export default class ElementFilter extends React.Component {

  render() {
    const {
      showSpecificElementsFilter,
      showElementPropertiesFilter,
      elementSelector,
      elementProperties
    } = this.props;

    return (
      <div>
        <span className="u-label">On</span>
        <Coral.Radio
            ref ="specificElementsRadio"
            name="filter"
            value="true"
            checked={showSpecificElementsFilter.checked}
            onChange={event => showSpecificElementsFilter.onChange(true)}>
          specific elements
        </Coral.Radio>
        <Coral.Radio
            ref ="anyElementRadio"
            name="filter"
            value="false"
            checked={!showSpecificElementsFilter.checked}
            onChange={event => showSpecificElementsFilter.onChange(false)}>
          any element
        </Coral.Radio>
        {
          showSpecificElementsFilter.value ?
            <div ref="specificElementFields">
              <ElementSelectorField elementSelector={elementSelector}/>
              <div>
                <Coral.Checkbox
                  ref="showElementPropertiesCheckbox"
                  {...showElementPropertiesFilter}>
                  and having certain property values...
                </Coral.Checkbox>
                {
                  showElementPropertiesFilter.value ?
                  <ElementPropertiesEditor
                    ref="elementPropertiesEditor"
                    elementProperties={elementProperties}/> : null
                }
              </div>
            </div> : null
        }
      </div>
    );
  }
}

export const reducers = {
  configToFormValues: reduceReducers(
    elementPropertiesEditorReducers.configToFormValues,
    (values, options) => {
      const { config: { elementSelector, elementProperties }, configIsNew } = options;

      return {
        ...values,
        showSpecificElementsFilter: Boolean(configIsNew || elementSelector || elementProperties),
        showElementPropertiesFilter: Boolean(elementProperties)
      };
    }
  ),
  formValuesToConfig: reduceReducers(
    elementPropertiesEditorReducers.formValuesToConfig,
    (config, values) => {
      config = {
        ...config
      };

      let { showSpecificElementsFilter, showElementPropertiesFilter } = values;

      if (!showSpecificElementsFilter) {
        delete config.elementSelector;
      }

      if (!showSpecificElementsFilter || !showElementPropertiesFilter) {
        delete config.elementProperties;
      }

      delete config.showSpecificElementsFilter;
      delete config.showElementPropertiesFilter;

      return config;
    }
  ),
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (values.showSpecificElementsFilter && !values.elementSelector) {
      errors.elementSelector = 'Please specify a selector. ' +
      'Alternatively, choose to target any element above.'
    }

    const elementPropertiesErrors = values.elementProperties.map((item) => {
      var result = {};
      if (item.value && !item.name) {
        result.name = 'Please fill in the property name.';
      }

      return result;
    });

    if (elementPropertiesErrors.some(x => x)) {
      errors.elementProperties = elementPropertiesErrors;
    }

    return errors;
  }
};