import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import Popup from '../popup';
import useSingle from './useSingle';
import useMultiple from './useMultiple';
import useOverlayStyle from './useOverlayStyle';
import { TdSelectInputProps } from './type';
import { StyledProps } from '../common';

export interface SelectInputProps extends TdSelectInputProps, StyledProps {}

const SelectInput = forwardRef((props: SelectInputProps, ref) => {
  const selectInputRef = useRef();
  const selectInputWrapRef = useRef();
  const { classPrefix: prefix } = useConfig();
  const { multiple, value, popupVisible, popupProps, borderless } = props;
  const { commonInputProps, inputRef, onInnerClear, renderSelectSingle } = useSingle(props);
  const { tagInputRef, renderSelectMultiple } = useMultiple(props);
  const { tOverlayStyle, innerPopupVisible, onInnerPopupVisibleChange } = useOverlayStyle(props);

  const popupClasses = classNames([
    props.className,
    `${prefix}-select-input`,
    {
      [`${prefix}-select-input--borderless`]: borderless,
      [`${prefix}-select-input--multiple`]: multiple,
      [`${prefix}-select-input--popup-visible`]: popupVisible ?? innerPopupVisible,
      [`${prefix}-select-input--empty`]: value instanceof Array ? !value.length : !value,
    },
  ]);

  useImperativeHandle(ref, () => ({
    ...(selectInputRef.current || {}),
    ...(inputRef.current || {}),
    ...(tagInputRef.current || {}),
  }));

  // 浮层显示的受控与非受控
  const visibleProps = { visible: popupVisible ?? innerPopupVisible };

  const mainContent = (
    <Popup
      ref={selectInputRef}
      style={props.style}
      className={popupClasses}
      trigger={popupProps?.trigger || 'click'}
      placement="bottom-left"
      content={props.panel}
      hideEmptyPopup={true}
      onVisibleChange={onInnerPopupVisibleChange}
      {...visibleProps}
      {...popupProps}
      overlayStyle={tOverlayStyle}
    >
      {multiple
        ? renderSelectMultiple({
            commonInputProps,
            onInnerClear,
          })
        : renderSelectSingle()}
    </Popup>
  );

  if (!props.tips) return mainContent;

  return (
    <div ref={selectInputWrapRef} className={`${prefix}-select-input__wrap`}>
      {mainContent}
      <div className={`${prefix}-input__tips ${prefix}-input__tips--${props.status || 'normal'}`}>{props.tips}</div>
    </div>
  );
});

SelectInput.displayName = 'SelectInput';

export default SelectInput;
