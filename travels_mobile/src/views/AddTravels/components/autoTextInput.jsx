import React, { useState, useEffect } from 'react';
import { TextInput, Platform } from 'react-native';

const AutoTextInput = (props) => {
  const [height, setHeight] = useState(0);

  const { minHeight = 16, maxHeight } = props;

  const onContentSizeChange = (event) => {
    let newHeight = event.nativeEvent.contentSize.height;
    changeHeight(newHeight);
  };

  const onChange = (event) => {
    if (Platform.OS === 'android') {
      let newHeight = event.nativeEvent.contentSize.height;
      changeHeight(newHeight);
    }
  };

  const changeHeight = (newHeight) => {
    if (newHeight < minHeight) {
      newHeight = minHeight;
    } else if (maxHeight && newHeight > maxHeight) {
      newHeight = maxHeight;
    }
    if (newHeight !== height) {
      setHeight(newHeight);
    }
  };

  useEffect(() => {
    if (props.onContentSizeChange) {
      props.onContentSizeChange({ nativeEvent: { contentSize: { height } } });
    }
  }, [height]);

  useEffect(() => {
    if (props.onChange) {
      props.onChange({ nativeEvent: { contentSize: { height } } });
    }
  }, [height]);

  return (
    <TextInput
      {...props}
      multiline
      onContentSizeChange={onContentSizeChange}
      onChange={onChange}
      style={[props.style, { height }]}
    />
  );
};

export default AutoTextInput;