import React, { forwardRef } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { TdPrimaryTableProps } from '../type';
import useConfig from '../../_util/useConfig';
import { DragSortInnerProps } from '../../_util/useDragSorter';
import TableRow from './TableRow';
import { ExpandInnerProps } from './Table';
import { useTableContext } from './TableContext';

interface TableBodyProps extends TdPrimaryTableProps, ExpandInnerProps, DragSortInnerProps {}

export interface RowSkipTdSpanColIndexsMap {
  [key: number]: number[];
}

type RowEventName =
  | 'onClick'
  | 'onDoubleClick'
  | 'onMouseOver'
  | 'onMouseDown'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onMouseUp';
type APIRowEventName =
  | 'onRowClick'
  | 'onRowDbClick'
  | 'onRowHover'
  | 'onRowMousedown'
  | 'onRowMouseenter'
  | 'onRowMouseleave'
  | 'onRowMouseup';
export type RowEvents = Record<RowEventName, React.MouseEventHandler<HTMLElement>> | { [key: string]: Function };

const rowEventsMap: Record<RowEventName, APIRowEventName> = {
  onClick: 'onRowClick',
  onDoubleClick: 'onRowDbClick',
  onMouseOver: 'onRowHover',
  onMouseDown: 'onRowMousedown',
  onMouseEnter: 'onRowMouseenter',
  onMouseLeave: 'onRowMouseleave',
  onMouseUp: 'onRowMouseup',
};

const TableBody = forwardRef((props: TableBodyProps, ref: React.Ref<HTMLTableSectionElement>): any => {
  const { classPrefix } = useConfig();
  const {
    data = [],
    rowKey,
    rowClassName,
    expandedRow,
    expandOnRowClick,
    handleExpandChange,
    renderExpandRow,
    rowspanAndColspan,
    sortOnRowDraggable,
    dragging,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
  } = props;
  const { flattenData } = useTableContext();
  const flattenDataVisible = flattenData || data;
  const rowSkipTdSpanColIndexsMap: RowSkipTdSpanColIndexsMap = {}; // 引用，不可重置。eg: { 0: [1, 3] } 表示第1行，第2、4列两个cell不渲染
  const isRowspanAndColspanFn = isFunction(rowspanAndColspan);
  const rowEvents = getRowEvents();

  // ==================== render ====================
  const rows = flattenDataVisible.map((row, index) => {
    const rowKeyValue = get(row, rowKey) || index;

    return (
      <React.Fragment key={rowKeyValue}>
        <TableRow
          record={row}
          rowIndex={index}
          rowKey={rowKey}
          rowClassName={rowClassName}
          expandedRow={expandedRow}
          expandOnRowClick={expandOnRowClick}
          handleExpandChange={handleExpandChange}
          {...(isRowspanAndColspanFn
            ? {
                isRowspanAndColspanFn,
                rowspanAndColspan,
                rowSkipTdSpanColIndexsMap,
              }
            : {})}
          rowEvents={rowEvents}
          {...(sortOnRowDraggable
            ? {
                sortOnRowDraggable,
                onDragStart,
                onDragOver,
                onDrop,
                onDragEnd,
              }
            : {})}
        />
        {expandedRow ? renderExpandRow(row, index, rowKeyValue) : null}
      </React.Fragment>
    );
  });

  function getRowEvents(): RowEvents {
    const rowEventProps = {};
    Object.keys(rowEventsMap).forEach((eventName) => {
      const apiEventName = rowEventsMap[eventName];
      const apiEvent = props[apiEventName];
      if (apiEvent) {
        rowEventProps[eventName] = apiEvent;
      }
    });
    return rowEventProps;
  }

  return (
    <tbody
      ref={ref}
      className={classNames(`${classPrefix}-table__body`, { [`${classPrefix}-table__body--dragging`]: dragging })}
    >
      {rows}
    </tbody>
  );
});

export default TableBody;
