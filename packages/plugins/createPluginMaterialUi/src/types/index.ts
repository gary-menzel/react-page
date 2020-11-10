import {
  CellPluginComponentProps,
  CellPlugin,
  JsonSchema,
} from '@react-page/core';

export type ControlsType<T> = React.ComponentType<ControlProps<T>>;

export type ControlsLayout = {
  columnCount: number;
};
// eslint-disable-next-line @typescript-eslint/ban-types
type CommonConfig<T extends {}> = {
  schema?: JsonSchema<T>;
  controlsLayout?: ControlsLayout;
  Renderer: React.ComponentType<CellPluginComponentProps<T>>;
};

export type ControlProps<T> = CellPluginComponentProps<T> & CommonConfig<T>;

export type PluginWithSchemaDefinition<T> = CommonConfig<T> & CellPlugin<T>;
