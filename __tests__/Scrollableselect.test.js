import React from 'react';
import {Platform, Animated, DatePickerAndroid, Modal, View} from 'react-native';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ScrollableSelect from '../scrollableselect.js';

Enzyme.configure({adapter: new Adapter()});

import 'jsdom-global/register';
console.error = function () {};

describe('ScrollableSelect', () => {

  it('initialize', () => {
    const wrapper = shallow(<ScrollableSelect />);
    const scrollableSelect = wrapper.instance();

    expect(scrollableSelect.props.duration).toEqual(300);
    expect(scrollableSelect.props.height).toBeGreaterThan(200);
    expect(scrollableSelect.props.confirmBtnText).toEqual('Confirm');
    expect(scrollableSelect.props.cancelBtnText).toEqual('Cancel');
    expect(scrollableSelect.props.customStyles).toMatchObject({});
    expect(scrollableSelect.props.disabled).toEqual(false);

    expect(wrapper.state('modalVisible')).toEqual(false);
    expect(wrapper.state('animatedHeight')).toBeInstanceOf(Animated.Value);
    expect(wrapper.state('index')).toEqual(0);

    const wrapper1 = shallow(
      <ScrollableSelect
        duration={400}
        confirmBtnText="Go"
        cancelBtnText="Stop"
        customStyles={{testStyle: 123}}
        disabled={true}
        values={[{label: 'Test 1', value: 1}, {label: 'Test 2', value: 2}, {label: 'Test 3', value: 3}]}
      />
    );
    const scrollableSelect1 = wrapper1.instance();

    expect(scrollableSelect1.props.duration).toEqual(400);
    expect(scrollableSelect1.props.confirmBtnText).toEqual('Go');
    expect(scrollableSelect1.props.cancelBtnText).toEqual('Stop');
    expect(scrollableSelect1.props.customStyles).toMatchObject({testStyle: 123});
    expect(scrollableSelect1.props.disabled).toEqual(true);
    expect(scrollableSelect1.props.values).toEqual([{label: 'Test 1', value: 1}, {label: 'Test 2', value: 2}, {label: 'Test 3', value: 3}]);


    // find not work with mount, and defaultProps not work with shallow...
    const wrapper2 = shallow(<ScrollableSelect values={[{label: 'Test 1', value: 1}, {label: 'Test 2', value: 2}, {label: 'Test 3', value: 3}]} value="Test 1"/>);
    const scrollableSelect2 = wrapper2.instance();
    expect(wrapper2.instance().getValue()).toEqual(1);

  });
  n;
  it('setModalVisible', () => {
    const wrapper = shallow(<ScrollableSelect />);
    const scrollableSelect = wrapper.instance();

    scrollableSelect.setModalVisible(true);

    expect(wrapper.state('modalVisible')).toEqual(true);
    expect(wrapper.state('animatedHeight')._animation._toValue).toBeGreaterThan(200);

    scrollableSelect.setModalVisible(false);
    expect(wrapper.state('animatedHeight')._animation._toValue).toEqual(0);
  });

  it('onPressCancel', () => {
    const setModalVisible = jest.fn();
    const onCloseModal = jest.fn();
    const wrapper = shallow(<ScrollableSelect onCloseModal={onCloseModal}/>);
    const scrollableSelect = wrapper.instance();
    scrollableSelect.setModalVisible = setModalVisible;

    scrollableSelect.onPressCancel();

    expect(setModalVisible).toHaveBeenCalledWith(false);
    expect(onCloseModal).toHaveBeenCalledTimes(1);
  });

  it('onPressMask', () => {
    const onPressMask = jest.fn();
    const wrapper = shallow(<ScrollableSelect onPressMask={onPressMask}/>);
    const scrollableSelect = wrapper.instance();

    scrollableSelect.onPressMask();

    expect(onPressMask).toHaveBeenCalledTimes(1);

    // call onPressCancel when without onPressMask cb func
    const onPressCancel = jest.fn();
    const wrapper1 = shallow(<ScrollableSelect />);
    const scrollableSelect1 = wrapper1.instance();
    scrollableSelect1.onPressCancel = onPressCancel;

    scrollableSelect1.onPressMask();

    expect(onPressCancel).toHaveBeenCalledTimes(1);
  });
});
