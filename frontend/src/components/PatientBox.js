import React from 'react';
import './PatientBox.css';

const getBackgroundColor = acuity => {
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
    shouldComponentUpdate(nextProps, nextState) {
      return this.props.patient.id !== nextProps.patient.id && this.props.patient.acuity !== nextProps.patient.acuity
    }
    render(){
        let patient = this.props.patient
        console.log("patient", patient)
        return <div 
            style={{background: getBackgroundColor(patient.acuity)}} 
            className="Patient">
                {patient.id}
        </div>
    };
}


export default PatientBox;