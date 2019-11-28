import React from 'react';
import './LinkSidebarContent.css';
import { connect } from 'react-redux';
import { addPredictedChild, removePredictedChild, deleteLink, hideSidebar} from '../redux/actions'

class LinkSidebarContent extends React.Component {
    constructor(props) {
        super(props)
    }

    childIsPredicted() {
        return this.getParentNode().predictedChildren.indexOf(this.getChildNode().id) >= 0
    }

    getParentNode() {
        return this.props.nodes.find(node => node.id == this.props.parent)
    }

    getChildNode() {
        return this.props.nodes.find(node => node.id == this.props.child)
    }

    updateLink() {
        if(!this.childIsPredicted()) {
            this.props.addPredictedChild(this.props.parent, this.props.child)
        } else {
            this.props.removePredictedChild(this.props.parent, this.props.child)
        }
    }

    handleDelete() {
        this.props.deleteLink(this.props.parent, this.props.child)
        this.props.hideSidebar();
    }

    render() {
        console.log(this.getParentNode())
        return (
            <div className="LinkSidebarContent">   
                <h3> {this.getParentNode().elementType} → {this.getChildNode().elementType} </h3>   
                <div className="input-container">
                    <label> Options </label>
                    <input type="checkbox" 
                        onChange={() => this.updateLink()}
                        checked={this.childIsPredicted()}>
                     </input>
                    <div className="checkbox-label">
                        <span className="title">Predicted edge</span><br/>
                        <span className="description">A predicted edge is an edge that 
                                allows a patient to directly follow 
                                this edge to another queue without
                                having to first follow mandatory edges
                        </span>
                    </div>
                    
                </div>  

                <button className="DeleteLinkButton" onClick={()=>{this.handleDelete()}}> Delete edge</button>       
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        nodes: state.nodes
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addPredictedChild: (parent, child) => {
            dispatch(addPredictedChild(parent, child))
        },
        removePredictedChild: (parent, child) => {
            dispatch(removePredictedChild(parent, child))
        },
        deleteLink: (parent, child) => {
            dispatch(deleteLink(parent, child))
        },
        hideSidebar: (parent, child) => {
            dispatch(hideSidebar())
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkSidebarContent)
