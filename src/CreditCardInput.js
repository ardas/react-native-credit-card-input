import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ViewPropTypes
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  form: {
    marginTop: 20
  },
  inputContainer: {
    marginLeft: 20
  },
  inputLabel: {
    fontWeight: "bold"
  },
  input: {
    height: 40
  }
});

const CVC_INPUT_WIDTH = 70;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH =
  Dimensions.get("window").width -
  EXPIRY_INPUT_WIDTH -
  CARD_NUMBER_INPUT_WIDTH_OFFSET;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const POSTAL_CODE_INPUT_WIDTH = 120; // https://github.com/yannickcr/eslint-plugin-react/issues/106
/* eslint react/prop-types: 0 */ export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,
    outerContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(
      PropTypes.shape(TextInput.propTypes)
    )
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "CARD NUMBER",
      expiry: "EXPIRY",
      cvc: "CVC/CCV",
      postalCode: "POSTAL CODE"
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "34567"
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: "black"
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {}
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = field => {
    if (!field) return;

    this.refs[field].focus();
  };

  _inputProps = field => {
    const {
      values,
      status,
      labels,
      onFocus,
      onChange,
      inputStyle,
      validColor,
      labelStyle,
      placeholders,
      invalidColor,
      onBecomeEmpty,
      onBecomeValid,
      placeholderColor,
      additionalInputsProps
    } = this.props;

    return {
      field,
      onFocus,
      onChange,
      ref: field,
      validColor,
      invalidColor,
      onBecomeEmpty,
      onBecomeValid,
      placeholderColor,
      value: values[field],
      label: labels[field],
      status: status[field],
      placeholder: placeholders[field],
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      additionalInputProps: additionalInputsProps[field]
    };
  };

  render() {
    const {
      focused,
      cardScale,
      requiresCVC,
      requiresName,
      cardImageBack,
      cardBrandIcons,
      cardFontFamily,
      cardImageFront,
      requiresPostalCode,
      outerContainerStyle,
      inputContainerStyle,
      values: { number, expiry, cvc, name, type }
    } = this.props;

    return (
      <View style={s.container}>
        <CreditCard
          focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc}
        />
        <View style={[s.form, outerContainerStyle]}>
          <CCInput
            {...this._inputProps("number")}
            keyboardType="numeric"
            containerStyle={[
              s.inputContainer,
              inputContainerStyle,
              { width: CARD_NUMBER_INPUT_WIDTH }
            ]}
          />
          <CCInput
            {...this._inputProps("expiry")}
            keyboardType="numeric"
            containerStyle={[
              s.inputContainer,
              inputContainerStyle,
              { width: EXPIRY_INPUT_WIDTH }
            ]}
          />
          {requiresCVC && (
            <CCInput
              {...this._inputProps("cvc")}
              keyboardType="numeric"
              containerStyle={[
                s.inputContainer,
                inputContainerStyle,
                { width: CVC_INPUT_WIDTH }
              ]}
            />
          )}
          {requiresName && (
            <CCInput
              {...this._inputProps("name")}
              containerStyle={[
                s.inputContainer,
                inputContainerStyle,
                { width: NAME_INPUT_WIDTH }
              ]}
            />
          )}
          {requiresPostalCode && (
            <CCInput
              {...this._inputProps("postalCode")}
              keyboardType="numeric"
              containerStyle={[
                s.inputContainer,
                inputContainerStyle,
                { width: POSTAL_CODE_INPUT_WIDTH }
              ]}
            />
          )}
        </View>
      </View>
    );
  }
}
