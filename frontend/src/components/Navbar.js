import React from 'react';
import "./Navbar.css";
import { connect } from 'react-redux';
import  {showLogs, showNodeConfig, showJSONEntrySidebar, addNode, deleteLinkModeSwitch, buildLinkModeSwitch } from '../redux/actions'
import {ReactComponent as PlayIcon} from '../play.svg';
import {ReactComponent as TerminalIcon} from '../terminal.svg';
import {ReactComponent as JSONIcon} from '../json.svg';
import {ReactComponent as NodeIcon} from '../nodeicon.svg';
import FileUploadForm from './UploadButton.js'
import { CSVLink } from 'react-csv';


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        
        this.sendCanvas = this.sendCanvas.bind(this);
        this.updateRunButton = this.updateRunButton.bind(this);
        this.handleLinkDeleteButton = this.handleLinkDeleteButton.bind(this)
        this.state = {runButtonpressed: false, 
                      button: null, 
                      patientDataToDownload: [],
                      hospitalDataToDownload: [],
                      doctorDataToDownload: []};
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }
    async sendCanvas(e){
        try {
            console.log("send canvas");
            // console.log(e)
            await this.setState({button: e.target}, this.updateRunButton)
            this.props.runHandler()
            let body = {nodes: this.props.nodes, duration: this.props.duration, rate: this.props.rate}
            console.log({body})
            let response = await fetch('http://localhost:' + process.env.REACT_APP_SERVER_PORT + '/start', {
                method: 'POST',
                headers: { 
                  Accept: 
                  'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            console.log({response});
            return response
        } catch (error) {
            console.error(error);
        }
    }

    async updateRunButton(){
        // console.log("updateRunButton")
        // console.log(this.state.runButtonpressed, this.state.button)
        if(this.state.button == null){
            return;
        }
        if(this.state.runButtonpressed){
            this.state.button.classList.remove("clickedRunButton")
        }else{
            this.state.button.classList.add("clickedRunButton")

        }
        this.setState({runButtonpressed: !this.state.runButtonpressed})
    }
    // async clickHandler(e){

    // }
    handleLinkDeleteButton(e){
        this.props.deleteLinkModeSwitch()
    }

    download = (event) => {
        console.log(this.props.stats);
        if (this.props.stats){
            console.log("----------------------------");
            const patient_data_to_download = this.props.stats["patients"]
            const hospital_data_to_download = this.props.stats["hospital"]
            const doctor_data_to_download = this.props.stats["doctors"]
            this.setState({ patientDataToDownload: patient_data_to_download, 
                            doctorDataToDownload: doctor_data_to_download,
                            hospitalDataToDownload: hospital_data_to_download}, () => {
                // click the CSVLink component to trigger the CSV download
                this.csvLinkpatients.link.click()
                this.csvLinkdoctors.link.click()
                this.csvLinkhospital.link.click()
             })
            console.log(this.props.stats);
        }else{
            console.log("no stats availble my guy");
            let data_to_download = {}
            this.setState({ patientDataToDownload: data_to_download }, () => {
                // click the CSVLink component to trigger the CSV download
                this.csvLink.link.click()
            })
        }
        // const currentRecords = this.reactTable.getResolvedState().sortedData;
        // var data_to_download = []
        // for (var index = 0; index < currentRecords.length; index++) {
        //    let record_to_download = {}
        //    for(var colIndex = 0; colIndex < columns.length ; colIndex ++) {
        //       record_to_download[columns[colIndex].Header] = currentRecords[index][columns[colIndex].accessor]
        //    }
        //    data_to_download.push(record_to_download)
        // }
        // this.setState({ patientDataToDownload: data_to_download }, () => {
        //    // click the CSVLink component to trigger the CSV download
        //    this.csvLink.link.click()
        // })
      } 

                // {/* <CSVLink data={JSON.stringify(this.props.stats)}>Download me</CSVLink>; */}
        //  {/* <CSVLink data={[this.props.stats]} filename={"my-file.csv"}
        //                 className="btn btn-primary" target="_blank"
        //                 >Download me</CSVLink>; */}
    render() {
        const csvData = [
            ["firstname", "lastname", "email"],
            ["Ahmed", "Tomi", "ah@smthing.co.com"],
            ["Raed", "Labes", "rl@smthing.co.com"],
            ["Yezzi", "Min l3b", "ymin@cocococo.com"]
            ];
        return (
            <div className="Navbar">   
                <FileUploadForm className="FileUploadButton"> </FileUploadForm>
                <button className="ShowLogsButton" onClick={this.download}> Download</button>
                <CSVLink data={this.state.patientDataToDownload}
                        filename="patient_data.csv"
                        className="hidden"
                        ref={(r) => this.csvLinkpatients = r}
                        target="_blank"/>
                <CSVLink data={this.state.hospitalDataToDownload}
                    filename="hospital_data.csv"
                    className="hidden"
                    ref={(r) => this.csvLinkhospital = r}
                    target="_blank"/>
                <CSVLink data={this.state.doctorDataToDownload}
                    filename="doctor_data.csv"
                    className="hidden"
                    ref={(r) => this.csvLinkdoctors = r}
                    target="_blank"/>
                <button className="ToggleLinkDeletebutton" onClick={this.props.deleteLinkModeSwitch}>Delete Links: { this.props.shouldDeleteLink? "on" : "off" }</button>
                <button className="ToggleBuildLinksbutton" onClick={this.props.buildLinkModeSwitch}>Build Links: { this.props.shouldBuildLink? "on" : "off" }</button>
                <button className="AddNodebutton" onClick={this.props.addNode}><NodeIcon/> Add Node</button>
                <button className="ShowLogsButton" onClick={this.props.showLogs}><TerminalIcon /> Show Logs</button>
                <button className="JSONEntryButton" onClick={this.props.showJSONEntry}> <JSONIcon/> JSON Entry </button>  
                <button className="RunButton" onClick={async (e) => {await this.sendCanvas(e);}}><PlayIcon /> Run</button>              
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { nodes: state.nodes, shouldDeleteLink: state.shouldDeleteLink, shouldBuildLink: state.shouldBuildLink}
}
  
const mapDispatchToProps = dispatch => {
    
    
    return {
        showLogs: () => {
            dispatch(showLogs())
        },
        showNodeConfig: () => {
            dispatch(showNodeConfig())
        },
        showJSONEntry: () => {
            dispatch(showJSONEntrySidebar())
        },
        addNode: () => {
            dispatch(addNode())
        },
        deleteLinkModeSwitch: () => {
            dispatch(deleteLinkModeSwitch())
        },
        buildLinkModeSwitch: () => {
            dispatch(buildLinkModeSwitch())
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar)