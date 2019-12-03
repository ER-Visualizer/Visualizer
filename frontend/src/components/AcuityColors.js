import React from 'react';
import { connect } from 'react-redux';
import { updateAcuityColors } from '../redux/actions';
import './AcuityColors.css';
import ColorPicker from './ColorPicker';

class AcuityColors extends React.Component{
  fillArrayWithFalse(length) {
    const arr = new Array(length);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = false;
    }
    return arr;
  }

  state = {
    // Boolean array with each element specifying whether the color
    // picker at that index is open or closed
    colorPickers: this.fillArrayWithFalse(this.props.numAcuities),
  };

  updateActiveColorPicker = (picker, value) => {
    const pickers = [...this.state.colorPickers];
    pickers[picker] = value;
    this.setState({ colorPickers: pickers });
  }

  handleClick = (picker) => {
    this.updateActiveColorPicker(picker, !this.state.colorPickers[picker]);
  };

  handleClose = (picker) => {
    this.updateActiveColorPicker(picker, false);
  };

  handleColorChange = (picker, color) => {
    console.log('changing', this.props.acuityColors);
    const colors = [...this.props.acuityColors];
    colors[picker] = color.hex;
    return this.props.updateAcuityColors(colors);
  };
  
  render() {
    const ColorPickers = [...Array(this.props.numAcuities).keys()].map(picker => {
      return <div key={picker} className="ColorPickerContainer">
        <div className="AcuityNumber">{picker + 1}</div>
        <ColorPicker
          color={this.props.acuityColors[picker]}
          onThumbnailClick={() => this.handleClick(picker)}
          displayColorPicker={this.state.colorPickers[picker]}
          onColorPickerChange={(newColor) => 
            this.handleColorChange(picker, newColor)}
          onCloseColorPicker={() => this.handleClose(picker)}
        />
      </div>;
    });

    return <div className="ColorPickersContainer">
      <label style={{textAlign: "center"}}>Acuity Color Picker</label>
      <div className="ColorPickers">{ColorPickers}</div>
    </div>;
  }
}

const mapStateToProps = state => {
  return {
      acuityColors: state.acuityColors
    }
}

const mapDispatchToProps = dispatch => {
  return {
    updateAcuityColors: (newAcuityColors) => {
      dispatch(updateAcuityColors(newAcuityColors))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AcuityColors);