import React from 'react';
import {
  Animated,
  TouchableHighlight,
  Picker,
  Modal,
  Text,
  View,
  Platform,
  Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import Style from './style';

const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right'];

class ScrollableSelect extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      allowPointerEvents: true,
      index: 0
    };

    const {values, value, labelValue} = this.props;
    this.inputValueText = null;

    if (value && !labelValue && values.find(v => v.label === value)) {
      let find_value = values.find(v => v.label === value);
      this.state.value = find_value.value;
      this.inputValueText = find_value.label;
    } else if (!value && labelValue && values.find(v => v.value === labelValue)) {
      let find_value = values.find(v => v.value === labelValue);
      this.state.value = find_value.value;
      this.inputValueText = find_value.label;
    }

    this.onSelectPress = this.onSelectPress.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.onPressMask = this.onPressMask.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onSelected() {
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(this.state.value, this.state.index);
    }
  }

  onSelectPress() {
    if (this.props.disabled) {
      return true;
    }

    Keyboard.dismiss();

    if (Platform.OS === 'ios') {
      this.setModalVisible(true);
    }

    if (typeof this.props.onOpenModal === 'function') {
      this.props.onOpenModal();
    }
  }

  setModalVisible(visible) {
    const {height, duration} = this.props;

    // slide animation
    if (visible) {
      this.setState({modalVisible: visible});
      return Animated.timing(
        this.state.animatedHeight,
        {
          toValue: height,
          duration
        }
      ).start();
    } else {
      return Animated.timing(
        this.state.animatedHeight,
        {
          toValue: 0,
          duration
        }
      ).start(() => {
        this.setState({modalVisible: visible});
      });
    }
  }

  onStartShouldSetResponder(e) {
    return true;
  }

  onMoveShouldSetResponder(e) {
    return true;
  }

  onPressMask() {
    if (typeof this.props.onPressMask === 'function') {
      this.props.onPressMask();
    } else {
      this.onPressCancel();
    }
  }

  onPressCancel() {
    this.setModalVisible(false);

    if (typeof this.props.onCloseModal === 'function') {
      this.props.onCloseModal();
    }
  }

  onPressConfirm() {
    this.onSelected();
    this.setModalVisible(false);

    this.inputValueText = this.props.values[this.state.index].label;

    if (typeof this.props.onCloseModal === 'function') {
      this.props.onCloseModal();
    }
  }

  onValueChange(item, itemIndex) {
    this.setState({...this.state, value: item, index: itemIndex}, () => {
      if (typeof this.props.onValueChange === 'function') {
        this.props.onValueChange(item, itemIndex);
      }
      if (Platform.OS !== 'ios') {
        this.onSelected();
      }
    });
  }

  getValue() {
    return this.state.value;
  }

  getLabel() {
    return this.props.values[this.state.index].label;
  }

  getTitleElement() {
    const {placeholder, customStyles, allowFontScaling} = this.props;

    if (this.inputValueText !== null) {
      return (
        <Text allowFontScaling={allowFontScaling} style={[Style.text, customStyles.text]}>
          {this.inputValueText}
        </Text>
      );
    }
    return (
      <Text
        allowFontScaling={allowFontScaling}
        style={[Style.placeholderText, customStyles.placeholderText]}
      >
        {placeholder}
      </Text>
    );
  }

  createPickerItem(item) {
    return <Picker.Item label={item.label} key={item.value} value={item.value} />;
  }

  render() {
    const {
      style,
      customStyles,
      androidMode,
      disabled,
      allowFontScaling,
      cancelBtnText,
      confirmBtnText,
      testID,
      cancelBtnTestID,
      confirmBtnTestID,
      TouchableComponent,
      values
    } = this.props;

    const inputStyles = [
      Style.inputStyle,
      customStyles.inputStyle,
      disabled && Style.disabled,
      disabled && customStyles.disabled
    ];

    if (Platform.OS !== 'ios') {
      return (
        <Picker
          mode={androidMode}
          selectedValue={this.state.value}
          style={[Style.pickerStyleAndroid, customStyles.pickerStyleAndroid]}
          onValueChange={this.onValueChange}
        >
          {values.map((v) => {return this.createPickerItem(v);})}
        </Picker>
      );
    }

    return (
      <TouchableComponent
        style={[Style.inputTouch, style]}
        underlayColor={'transparent'}
        onPress={this.onSelectPress}
        testID={testID}
      >
        <View style={[Style.inputTouchBody, customStyles.inputTouchBody]}>
          <View style={inputStyles}>
            {this.getTitleElement()}
          </View>
          <Modal
            transparent
            animationType="none"
            visible={this.state.modalVisible}
            supportedOrientations={SUPPORTED_ORIENTATIONS}
            onRequestClose={() => { this.setModalVisible(false); }}
          >
            <View style={{flex: 1}}>
              <TouchableComponent
                style={[Style.mask, customStyles.mask]}
                activeOpacity={1}
                underlayColor={'#00000077'}
                onPress={this.onPressMask}
              >
                <TouchableComponent
                  underlayColor={'#fff'}
                  style={{flex: 1}}
                >
                  <Animated.View
                    style={[Style.con, {height: this.state.animatedHeight}, customStyles.con]}
                  >
                    <View pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'}>
                      <Picker
                        selectedValue={this.state.value}
                        style={[Style.pickerStyle, customStyles.pickerStyle]}
                        onValueChange={this.onValueChange}
                      >
                        {values.map((v) => {return this.createPickerItem(v);})}
                      </Picker>
                    </View>
                    <TouchableComponent
                      underlayColor={'transparent'}
                      onPress={this.onPressCancel}
                      style={[Style.btnText, Style.btnCancel, customStyles.btnText, customStyles.btnCancel]}
                    >
                      <Text
                        allowFontScaling={allowFontScaling}
                        style={[Style.btnTextText, Style.btnTextCancel, customStyles.btnTextText, customStyles.btnTextCancel]}
                      >
                        {cancelBtnText}
                      </Text>
                    </TouchableComponent>
                    <TouchableComponent
                      underlayColor={'transparent'}
                      onPress={this.onPressConfirm}
                      style={[Style.btnText, Style.btnConfirm, customStyles.btnText, customStyles.btnConfirm]}
                    >
                      <Text
                        allowFontScaling={allowFontScaling}
                        style={[Style.btnTextText, customStyles.btnTextText]}
                      >
                        {confirmBtnText}
                      </Text>
                    </TouchableComponent>
                  </Animated.View>
                </TouchableComponent>
              </TouchableComponent>
            </View>
          </Modal>
        </View>
      </TouchableComponent>
    );
  }

}

ScrollableSelect.defaultProps = {
  androidMode: 'dropdown',
  // component height: 216(UIPickerView) + 1(borderTop) + 42(marginTop), IOS only
  height: 259,

  // slide animation duration time, default to 300ms, IOS only
  duration: 300,
  customStyles: {},

  confirmBtnText: 'Confirm',
  cancelBtnText: 'Cancel',

  values: [],
  disabled: false,
  allowFontScaling: true,
  placeholder: '',
  TouchableComponent: TouchableHighlight,
  modalOnResponderTerminationRequest: e => true
};

ScrollableSelect.propTypes = {
  onValueChange: PropTypes.func,
  onSelect: PropTypes.func,
  values: PropTypes.array,
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  height: PropTypes.number,
  duration: PropTypes.number,
  customStyles: PropTypes.object,
  allowFontScaling: PropTypes.bool,
  onOpenModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  onPressMask: PropTypes.func,
  placeholder: PropTypes.string
};

export default ScrollableSelect;
