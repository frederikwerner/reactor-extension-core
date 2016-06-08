import DOM from '../dom';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('DOM view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(DOM, extensionBridge);
  });

  it('selects ID preset for new settings', () => {
    extensionBridge.init();

    const { elementPropertyPresetsSelect } = instance.refs;

    expect(elementPropertyPresetsSelect.props.value).toBe('id');
  });


  it('sets form values from settings using element property preset', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo',
        elementProperty: 'innerHTML'
      }
    });

    const { elementSelectorField, elementPropertyPresetsSelect} = instance.refs;

    expect(elementSelectorField.props.value).toBe('foo');
    expect(elementPropertyPresetsSelect.props.value).toBe('innerHTML');
  });

  it('sets form values from settings using custom element property', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo',
        elementProperty: 'bar'
      }
    });

    const {
      elementSelectorField,
      elementPropertyPresetsSelect,
      customElementPropertyField
    } = instance.refs;

    expect(elementSelectorField.props.value).toBe('foo');
    expect(elementPropertyPresetsSelect.props.value).toBe('custom');
    expect(customElementPropertyField.props.value).toBe('bar');
  });

  it('sets error if element selector not provided', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorWrapper } = instance.refs;

    expect(elementSelectorWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets settings from form values using element property preset', () => {
    extensionBridge.init();

    const { elementSelectorField, elementPropertyPresetsSelect } = instance.refs;

    elementSelectorField.props.onChange('foo');
    elementPropertyPresetsSelect.props.onChange('innerHTML');

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: 'foo',
      elementProperty: 'innerHTML'
    });
  });

  it('sets settings from form values using custom element property', () => {
    extensionBridge.init();

    const {
      elementSelectorField,
      elementPropertyPresetsSelect
      } = instance.refs;

    elementSelectorField.props.onChange('foo');
    elementPropertyPresetsSelect.props.onChange('custom');

    const {
      customElementPropertyField
    } = instance.refs;

    customElementPropertyField.props.onChange('bar');

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: 'foo',
      elementProperty: 'bar'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo',
        elementProperty: ''
      }
    });

    expect(extensionBridge.validate()).toBe(false);

    const { customElementPropertyWrapper } = instance.refs;

    expect(customElementPropertyWrapper.props.error).toEqual(jasmine.any(String));
  });
});