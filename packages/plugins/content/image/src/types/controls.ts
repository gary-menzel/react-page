import { CellPluginComponentProps } from '@react-page/core';
import { ImageUploadType } from '@react-page/ui';
import { ImageState } from './state';
import { Translations } from './translations';

export type ImageControlType = React.ComponentType<
  CellPluginComponentProps<ImageState> & {
    imageUpload?: ImageUploadType;
    translations: Translations;
  }
>;
