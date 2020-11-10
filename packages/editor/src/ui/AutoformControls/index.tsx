import React, { Fragment, useEffect, useMemo } from 'react';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import {
  AutoFields as AutoFieldsOrg,
  AutoForm as AutoFormOrg,
} from 'uniforms-material';
import {
  AutoformControlsDef,
  CellPluginComponentProps,
  JsonSchema,
} from '../../core/types';
import makeUniformsSchema from './makeUniformsSchema';

// see https://github.com/vazco/uniforms/issues/617
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AutoForm: any = AutoFormOrg;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AutoFields: any = AutoFieldsOrg;

const getDefaultValue = function (
  bridge: JSONSchemaBridge
): { [key: string]: unknown } {
  return bridge.getSubfields(null).reduce(
    (acc, fieldName) => ({
      ...acc,
      [fieldName]: bridge.getInitialValue(fieldName),
    }),
    {}
  );
};

type Props<T> = CellPluginComponentProps<T> & AutoformControlsDef<T>;
function AutoformControls<T>({
  onChange,
  data,
  schema,
  columnCount = 2,
}: Props<T>) {
  const bridge = useMemo(() => makeUniformsSchema<T>(schema as JsonSchema<T>), [
    schema,
  ]);
  useEffect(() => {
    const newDefaultData = {
      ...getDefaultValue(bridge),
      ...(data ?? {}),
    };
    onChange(newDefaultData);
  }, [bridge]);
  return (
    <AutoForm model={data} autosave={true} schema={bridge} onSubmit={onChange}>
      <div
        style={{
          columnCount: columnCount,
          columnRule: '1px solid #E0E0E0',
          columnGap: 48,
        }}
      >
        <AutoFields element={Fragment} />
      </div>
    </AutoForm>
  );
}

export default AutoformControls;
