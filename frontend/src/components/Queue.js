import React from 'react';
import './Queue.css';
import PatientBox from './PatientBox';
import Patient from '../models/Patient';
import { FixedSizeGrid as Grid } from 'react-window';
class Queue extends React.Component{
    constructor(props){
        super(props)

    }
    shouldComponentUpdate(nextProps, nextState) {
      return JSON.stringify(this.props.patients) !== JSON.stringify(nextProps.patients);
    }
    render(){
    let patients = this.props.patients
    let list_patients = []
    let patient_keys = (Object.keys(patients))
    if (patient_keys.length > 1){
        list_patients = []
        for(let i = 0; i < (patient_keys).length; i++){
            if(patients[(patient_keys)[i]] != null){
                list_patients.push(patients[(patient_keys[i])])

            }
        }
        list_patients.sort((patient1, patient2) =>
        patient1.accuity - patient2.accuity);
    }

     const Cell = ({ columnIndex, rowIndex, style }) => (
      <div style={style}>
        {(rowIndex * 5) + columnIndex < list_patients.length && 
            <PatientBox key={columnIndex.toString() + "," + rowIndex.toString()} patient={list_patients[(rowIndex * 5) + columnIndex]} /> 
        }
      </div>
    );

    let row_count = Math.ceil(list_patients.length/6)
    return (
        <div className="QueueContainer" style={{height: this.props.height || 150 }}>
            <div className="Queue">
              <div className="counter">{list_patients.length}</div>
                <Grid
                columnCount={5}
                columnWidth={30}
                height={145}
                rowCount={row_count}
                rowHeight={30}
                width={200}
              >
                {Cell}
              </Grid>
            </div>
        </div>
    )
    };
}

export default Queue;