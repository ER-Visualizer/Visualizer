import React from 'react';
import './ColorPicker.css';
import { ChromePicker } from "react-color";

class ColorPicker extends React.Component{
  render() {
    return (
      <div>
        <div className="Swatch" onClick={this.props.onThumbnailClick}>
          <div 
            className="Color" 
            style={{ background: this.props.color }} 
          />
        </div>
        {this.props.displayColorPicker ? <div className="Popover">
          <div className="Cover" onClick={this.props.onCloseColorPicker}/>
          <ChromePicker color={this.props.color} onChangeComplete={this.props.onColorPickerChange} />
        </div> : null}
      </div>
    )
  }
}

export default ColorPicker;