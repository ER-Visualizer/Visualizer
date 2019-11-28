import React from 'react';
import './ResourceQueue.css';
import PatientBox from './PatientBox';
import Patient from '../models/Patient';

const ResourceQueue = ({ patients }) => {
    // console.log({patients});
    if (patients.length > 1){
        patients.sort((patient1, patient2) =>
        patient1.accuity - patient2.accuity);
    }
    const PatientBoxes = patients.map((patient, i) =>
        <PatientBox key={i} patient={patient} />
    );

    return (
        <div className="ResourceQueueContainer">
            <div className="ResourceQueue">
                {PatientBoxes}
            </div>
        </div>
    )
};

export default ResourceQueue;