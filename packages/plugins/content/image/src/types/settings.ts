import {
  CellPluginRenderer,
  CellPluginCustomControlsComonent,
} from '@react-page/core';
import { ImageUploadType } from '@react-page/ui';
import { ImageState } from './state';

import { Translations } from './translations';

export type ImageSettings = {
  imageUpload?: ImageUploadType;
  Renderer: CellPluginRenderer<ImageState>;
  Controls: CellPluginCustomControlsComonent<ImageState>;
  translations?: Translations;
  IconComponent?: React.ReactNode;
};
