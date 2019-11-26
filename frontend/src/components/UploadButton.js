import React from 'react'
import axios, { post } from 'axios';
import "./Navbar.css";

class FileUploadForm extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      file: null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file).then((response)=>{
      console.log(response.data);
    })
  }
  onChange(e) {
    this.setState({file:e.target.files[0]})
  }
  fileUpload(file){
    const url = 'http://localhost:8000/csv';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return axios.post(url, formData,config)
  }

  render() {
    return (
            <form onSubmit={this.onFormSubmit}>
        <input className="FileUploadButton" type="file" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>

   )
  }
}



export default FileUploadForm