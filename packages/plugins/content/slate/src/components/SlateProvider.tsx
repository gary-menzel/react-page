import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Node, Transforms } from 'slate';
import { Slate, withReact } from 'slate-react';
import withInline from '../slateEnhancer/withInline';
import withPaste from '../slateEnhancer/withPaste';
import { SlateProps } from '../types/component';

const SlateProvider: React.FC<SlateProps> = (props) => {
  const { data, plugins, children, defaultPluginType } = props;
  const editor = useMemo(
    () =>
      withPaste(
        plugins,
        defaultPluginType
      )(withReact(withInline(plugins)(createEditor()))),
    []
  );
  const onChangeDebounced = useMemo(() => debounce(props.onChange, 200), [
    props.onChange,
  ]);
  const [value, setValue] = useState<Node[]>(data?.slate);

  useEffect(() => {
    if (data.selection) {
      // update seleciton, if changed from outside (e.g. through undo)
      Transforms.select(editor, data.selection);
    } else {
      // deselect, otherwise slate might throw an eerror if cursor is now on a non existing dom node
      Transforms.deselect(editor);
    }
    setValue(data?.slate);
  }, [data?.slate, data?.selection]);

  const onChange = useCallback(
    (v) => {
      if (editor.selection) {
        setValue(v);

        onChangeDebounced(
          {
            slate: v,
            selection: editor.selection,
          },
          {
            // mark as not undoable when state is same
            // that happens if only selection was changed
            notUndoable: v === data.slate,
          }
        );
      }
    },
    [onChangeDebounced]
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      {children}
    </Slate>
  );
};

export default SlateProvider;
