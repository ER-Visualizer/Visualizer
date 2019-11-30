import React from 'react';
import "./Navbar.css";
import { connect } from 'react-redux';
import  {showLogs, showNodeConfig, showJSONEntrySidebar, addNode, deleteLinkModeSwitch, buildLinkModeSwitch, simulationStarted } from '../redux/actions'
import {ReactComponent as PlayIcon} from '../play.svg';
import {ReactComponent as TerminalIcon} from '../terminal.svg';
import {ReactComponent as JSONIcon} from '../json.svg';
import {ReactComponent as NodeIcon} from '../nodeicon.svg';
import FileUploadForm from './UploadButton.js'
import { CSVLink } from 'react-csv';
import logo from './logo_green.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            toast("Simulation is starting!", {autoClose: 7000});
            await this.props.simulationStarted()
            await this.setState({button: e.target}, this.updateRunButton)
            this.props.runHandler()
            let body = {nodes: this.props.nodes, duration: parseInt(this.props.duration), rate: parseInt(this.props.rate)}
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
            toast.error("An error occured!");
            console.error(error);
        }
    }

    async updateRunButton(){
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
    
    handleLinkDeleteButton(e){
        this.props.deleteLinkModeSwitch()
    }

    download = (event) => {
        console.log("download")
        console.log(this.props.stats);
        if (this.props.stats != undefined && this.props.stats != null && this.props.stats){
            toast("Downloading!");
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
            toast("No stats available");
            console.log("no stats availble my guy");
            let data_to_download = {}
 
        }
      } 


    render() {
        
        return (
            <div className="Navbar">   
             <ToastContainer />
                <img className="logo" src={logo} />
                
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
        },
        simulationStarted: () => {
            dispatch(simulationStarted())
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar)