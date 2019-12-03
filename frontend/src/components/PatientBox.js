import React from 'react';
import './PatientBox.css';
import { connect } from 'react-redux';

class PatientBox extends React.Component {
    // Only rerender component if the patient's id or acuity changes
    shouldComponentUpdate(nextProps, nextState) {
      return this.props.patient.id !== nextProps.patient.id && this.props.patient.acuity !== nextProps.patient.acuity
    }

    getBackgroundColor = acuity =>
        this.props.acuityColors[acuity-1]
    
    render(){
        let patient = this.props.patient;

        return <div
            style={{background: this.getBackgroundColor(patient.acuity)}} 
            className="Patient">
                {patient.id}
        </div>
    };
}

const mapStateToProps = state => {
    return {
        acuityColors: state.acuityColors
    }
}

export default connect(
    mapStateToProps
)(PatientBox);