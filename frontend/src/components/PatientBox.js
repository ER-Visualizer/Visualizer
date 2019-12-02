import React from 'react';
import './PatientBox.css';

const getBackgroundColor = accuity => {
    const shadesOfRed = [
        "#781A03",
        "#A02304",
        "#C82C05",
        "#D35637",
        "#DE8069",
    ]

    return shadesOfRed[accuity-1]
};

class PatientBox extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
      return this.props.patient.id !== nextProps.patient.id && this.props.patient.accuity !== nextProps.patient.accuity
    }
    render(){
        let patient = this.props.patient
        return <div 
            style={{background: getBackgroundColor(patient.accuity)}} 
            className="Patient">
                {patient.id}
        </div>
    };
}


export default PatientBox;