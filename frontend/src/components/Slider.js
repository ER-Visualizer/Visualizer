import React from 'react';
class Slider extends React.Component {
	constructor(props) {
        super(props);
        this.rangeChange = this.rangeChange.bind(this)
        this.state = {number: this.props.initNum, max: this.props.max};

    }

  rangeChange(e) {
    this.setState({ number: e.target.value })
    this.props.handleClick(e)
  }
  render() {
    return (
      <div>
       <label> {this.props.text} </label><br></br>
        <label>
          { this.state.number }
        </label>
        <input type="range" min="0.0" max={this.state.max} step="0.5" value={ this.state.number } onChange={ this.rangeChange } />
      </div>
    )
  }
}
export default Slider;