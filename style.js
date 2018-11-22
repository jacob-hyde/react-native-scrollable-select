import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  inputStyle: {
    alignItems: 'flex-end',
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center'
  },
  disabled: {
    backgroundColor: '#eee'
  },
  inputTouchBody: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    color: '#c9c9c9'
  },
  btnText: {
    position: 'absolute',
    top: 0,
    height: 42,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnTextText: {
    fontSize: 16,
    color: '#46cf98'
  },
  btnTextCancel: {
    color: '#666'
  },
  btnCancel: {
    left: 0
  },
  btnConfirm: {
    right: 0
  },
  mask: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#00000077'
  },
  con: {
    backgroundColor: '#fff',
    height: 0,
    overflow: 'hidden'
  },
  text: {
    color: '#333'
  },
  pickerStyle: {
    height: 50,
    marginTop: 42,
    borderTopColor: '#ccc',
    borderTopWidth: 1
  },
  pickerStyleAndroid: {
    height: 50,
    width: 150
  }
});

export default styles;
