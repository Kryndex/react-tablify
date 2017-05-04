// @flow

import React from 'react';
import TableHeader from '../Header/TableHeader';
import TableHeaderColumn from '../Header/TableHeaderColumn';
import TableBody from '../Body/TableBody';
import TableBodyColumn from '../Body/TableBodyColumn';
import TableFooter from '../Footer/TableFooter';
import TableFooterColumn from '../Footer/TableFooterColumn';
import { toArray, wrapColumns, cloneWithProps } from '../utils';

type TableProps = {
  dataset: Array<any>,
  children: any
};

const getChildrenArray = (props: TableProps) => {
  const { dataset, children, ...others } = props;
  let childrenArray = [];
  if (children && Array.isArray(children)) {
    childrenArray = children;
  } else if (
    children !== null &&
    children !== undefined &&
    children !== false
  ) {
    childrenArray = [children];
  }
  let result = [];
  const accumulator = {
    header: [],
    body: [],
    footer: [],
    raws: [],
  };
  childrenArray.forEach((child, index) => {
    if (child && child.type) {
      switch (child.type) {
        case TableHeaderColumn:
          accumulator.header.push(child);
          break;
        case TableFooterColumn:
          accumulator.footer.push(child);
          break;
        case TableBodyColumn:
          accumulator.body.push(child);
          break;
        case TableHeader:
        case TableBody:
        case TableFooter:
          result.push(child);
          break;
        default:
          accumulator.raws.push(
            cloneWithProps(child, { dataset, ...others }, index),
          );
          break;
      }
    }
  });
  if (accumulator.header.length !== 0) {
    result.unshift(wrapColumns(accumulator.header, TableHeader, 'header'));
  }
  if (accumulator.body.length !== 0) {
    result.push(wrapColumns(accumulator.body, TableBody, 'body'));
  }
  if (accumulator.footer.length !== 0) {
    result.push(wrapColumns(accumulator.footer, TableFooter, 'footer'));
  }
  result = result.map((container) => {
    let newContainer;
    if (container.type === TableBody) {
      const containerChildren = toArray(container.props.children);
      newContainer = React.cloneElement(
        container,
        {},
        // eslint-disable-next-line
        [].concat.apply(
          [],
          dataset.map((data, dataIndex) =>
            containerChildren.map((row, rowIndex) => (
              <row.type {...row.props}>
                {toArray(row.props.children).map((column, columnIndex) =>
                  cloneWithProps(
                    column,
                    { ...others, data, dataIndex },
                    `${rowIndex}${columnIndex}`,
                  ),
                )}
              </row.type>
            )),
          ),
        ),
      );
    } else {
      newContainer = React.cloneElement(
        container,
        {},
        toArray(container.props.children).map((row, rowIndex) => (
          <row.type {...row.props}>
            {toArray(row.props.children).map((column, columnIndex) =>
              cloneWithProps(column, { ...others }, `${rowIndex}${columnIndex}`),
            )}
          </row.type>
        )),
      );
    }
    return newContainer;
  });
  result = [...result, ...accumulator.raws];
  return result;
};

export default class Table extends React.Component {
  static defaultProps = {
    dataset: [],
  };

  props: TableProps;

  render() {
    const { dataset, children, ...others } = this.props;
    return (
      <table {...others}>
        {getChildrenArray(this.props)}
      </table>
    );
  }
}