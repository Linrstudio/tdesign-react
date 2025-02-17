import React, { useRef, useState, useEffect, MouseEvent, FormEvent } from 'react';
import isObject from 'lodash/isObject';
import pick from 'lodash/pick';
import { SelectInputCommonProperties } from './interface';
import Input, { InputValue } from '../input';
import { TdSelectInputProps } from './type';

export interface RenderSelectSingleInputParams {
  tPlaceholder: string;
}

// single 和 multiple 共有特性
const COMMON_PROPERTIES = [
  'status',
  'clearable',
  'disabled',
  'label',
  'placeholder',
  'readonly',
  'suffix',
  'suffixIcon',
  'onPaste',
  'onEnter',
  'onMouseenter',
  'onMouseleave',
];

const DEFAULT_KEYS = {
  label: 'label',
  key: 'key',
};

export default function useSingle(props: TdSelectInputProps) {
  const { value } = props;
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState<string | number>('');

  const commonInputProps: SelectInputCommonProperties = pick(props, COMMON_PROPERTIES);

  const onInnerClear = (context: { e: MouseEvent<SVGElement> }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    setInputValue('');
  };

  const onInnerInputChange = (
    value: InputValue,
    context: { e: FormEvent<HTMLDivElement> | MouseEvent<HTMLElement | SVGElement> },
  ) => {
    if (props.allowInput) {
      setInputValue(value);
      props.onInputChange?.(value, context);
    }
  };

  useEffect(() => {
    const iKeys = { ...DEFAULT_KEYS, ...props.keys };
    const val = isObject(value) ? value[iKeys.label] : value;
    setInputValue(val);
  }, [props.keys, value]);

  const renderSelectSingle = () => {
    // 单选，值的呈现方式
    const singleValueDisplay = !props.multiple ? props.valueDisplay : null;
    return (
      <Input
        ref={inputRef}
        {...commonInputProps}
        autoWidth={props.borderless || props.autoWidth}
        placeholder={singleValueDisplay ? '' : props.placeholder}
        value={singleValueDisplay ? undefined : inputValue}
        label={
          <>
            {props.label}
            {singleValueDisplay}
          </>
        }
        onChange={onInnerInputChange}
        readonly={!props.allowInput}
        onClear={onInnerClear}
        onBlur={(val, context) => {
          props.onBlur?.(value, { ...context, inputValue: val });
        }}
        onFocus={(val, context) => {
          props.onFocus?.(value, { ...context, inputValue: val });
        }}
        {...props.inputProps}
      />
    );
  };

  return {
    inputRef,
    commonInputProps,
    onInnerClear,
    renderSelectSingle,
  };
}
