import { CellPlugin, lazyLoad } from '@react-page/core';
import createPlugin from './createPlugin';
import ImageHtmlRenderer from './Renderer/ImageHtmlRenderer';
import { ImageSettings } from './types/settings';
import { ImageState } from './types/state';
import { ImageUploadType } from '@react-page/ui';
const ImageControls = lazyLoad(() => import('./Controls/ImageControls'));

const imagePlugin: (
  settings?: Partial<ImageSettings>
) => CellPlugin<ImageState> = (settings) =>
  createPlugin({
    Renderer: ImageHtmlRenderer,
    Controls: ImageControls,
    ...settings,
  });

const image = imagePlugin();
export default image;
export { ImageUploadType };
export { imagePlugin };
