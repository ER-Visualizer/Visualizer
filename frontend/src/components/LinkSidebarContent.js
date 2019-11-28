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
        console.log(this.props)
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
        console.log("re rendering link sidebar", this.props);
        console.log(this.childIsPredicted())
        return (
            <div className="LinkSidebarContent">      
                <div className="input-container">
                    <input type="checkbox" 
                        onChange={() => this.updateLink()}
                        checked={this.childIsPredicted()}>
                     </input>
                    <label>Predicted edge</label>
                </div>  

                <button className="DeleteNodebutton" onClick={()=>{this.handleDelete()}}> Delete </button>       
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
