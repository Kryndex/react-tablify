// @flow

import React from 'react';

// eslint-disable-next-line
export const flatten = (array: Array<any>) => [].concat.apply([], array);

export const toArray = (array: any, reactChildren: boolean) => {
  let result = [];
  const isArray = Array.isArray(array);
  if (isArray) {
    result = array;
  } else if (array !== undefined && array !== null && !isArray) {
    result = [array];
  }
  if (reactChildren) {
    result = React.Children.toArray(result) || [];
  }
  return result;
};

export const cloneWithProps = (element: Object, props: Object, key: any) => {
  if (!element || !element.type) return null;
  const newProps = Object.assign({}, props, element.props);
  if (newProps.key === undefined) newProps.key = key;
  return <element.type {...newProps} />;
};

let Row;
export const setRowComponent = (Component: string | Function) => {
  Row = Component;
};

export const componentOr = (prop: string = 'component') => (
  fallback: string | Function,
) => (props: Object) => {
  const Component = props[prop] || fallback;
  return <Component {...props} />;
};

export const wrapColumns = (
  columns: Array<Object>,
  Component: Object,
  key: string,
) => (
  <Component key={key}>
    <Row>
      {columns}
    </Row>
  </Component>
);
