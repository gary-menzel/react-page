import { CellPluginComponentProps } from '@react-page/core';
import { SpacerState } from './state';
import { Translations } from './translations';

export interface SpacerSettings {
  Renderer: React.ComponentType<CellPluginComponentProps<SpacerState>>;

  translations?: Translations;
}
