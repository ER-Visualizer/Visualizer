import React from 'react';
import './PatientBox.css';

const getBackgroundColor = acuity => {
    // The colors for the different acuities, starting from acuity 1
    const shadesOfRed = [
        "#781A03",
        "#A02304",
        "#C82C05",
        "#D35637",
        "#DE8069",
    ]

    return shadesOfRed[acuity-1]
};

class PatientBox extends React.Component {
    // Only rerender component if the patient's id or acuity changes
    shouldComponentUpdate(nextProps, nextState) {
      return this.props.patient.id !== nextProps.patient.id && this.props.patient.acuity !== nextProps.patient.acuity
    }
    render(){
        let patient = this.props.patient

        return <div 
            style={{background: getBackgroundColor(patient.acuity)}} 
            className="Patient">
                {patient.id}
        </div>
    };
}


export default PatientBox;