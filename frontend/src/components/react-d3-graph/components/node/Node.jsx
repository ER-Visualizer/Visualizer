import React from "react";

import CONST from "./node.const";

import nodeHelper from "./node.helper";
import Queue from "../../../Queue.js"
import ResourceQueue from "../../../ResourceQueue.js"
import store from '../../../../redux/store'
/**
 * Node component is responsible for encapsulating node render.
 * @example
 * const onClickNode = function(nodeId) {
 *      window.alert('Clicked node', nodeId);
 * };
 *
 * const onRightClickNode = function(nodeId) {
 *      window.alert('Right clicked node', nodeId);
 * }
 *
 * const onMouseOverNode = function(nodeId) {
 *      window.alert('Mouse over node', nodeId);
 * };
 *
 * const onMouseOutNode = function(nodeId) {
 *      window.alert('Mouse out node', nodeId);
 * };
 *
 * <Node
 *     id='nodeId'
 *     cx=22
 *     cy=22
 *     fill='green'
 *     fontSize=10
 *     fontColor='black'
 *     fontWeight='normal'
 *     dx=90
 *     label='label text'
 *     opacity=1
 *     renderLabel=true
 *     size=200
 *     stroke='none'
 *     strokeWidth=1.5
 *     svg='assets/my-svg.svg'
 *     type='square'
 *     viewGenerator=(node) => <CustomComponent node={node} />
 *     className='node'
 *     onClickNode={onClickNode}
 *     onRightClickNode={onRightClickNode}
 *     onMouseOverNode={onMouseOverNode}
 *     onMouseOutNode={onMouseOutNode} />
 */
export default class Node extends React.Component {
    /**
     * Handle click on the node.
     * @returns {undefined}
     */
    handleOnClickNode = () => this.props.onClickNode && this.props.onClickNode(this.props.id);

    /**
     * Handle right click on the node.
     * @param {Object} event - native event.
     * @returns {undefined}
     */
    handleOnRightClickNode = event => this.props.onRightClickNode && this.props.onRightClickNode(event, this.props.id);

    /**
     * Handle mouse over node event.
     * @returns {undefined}
     */
    handleOnMouseOverNode = () => this.props.onMouseOverNode && this.props.onMouseOverNode(this.props.id);

    /**
     * Handle mouse out node event.
     * @returns {undefined}
     */
    handleOnMouseOutNode = () => this.props.onMouseOut && this.props.onMouseOut(this.props.id);

    render() {
        // console.log("NODE JSX", store.getState())
        const nodeProps = {
            cursor: this.props.cursor,
            onClick: this.handleOnClickNode,
            onContextMenu: this.handleOnRightClickNode,
            onMouseOut: this.handleOnMouseOutNode,
            onMouseOver: this.handleOnMouseOverNode,
            opacity: this.props.opacity,
        };

        const textProps = {
            dx: this.props.dx || CONST.NODE_LABEL_DX,
            dy: CONST.NODE_LABEL_DY,
            fill: this.props.fontColor,
            fontSize: this.props.fontSize,
            fontWeight: this.props.fontWeight,
            opacity: this.props.opacity,
        };

        const size = this.props.size;

        let gtx = this.props.cx,
            gty = this.props.cy,
            label = null,
            node = null;
        let patient_list = null
        let processing_list = []
        for(let i = 0; i < store.getState().nodes.length; i++){
            if(store.getState().nodes[i].id == this.props.id){
                patient_list = store.getState().nodes[i].patients
                processing_list = store.getState().nodes[i].processing
            }
        }
        if (this.props.svg || this.props.viewGenerator) {
            const height = size / 10;
            const width = size / 10;
            const tx = width / 2;
            const ty = height / 2;
            const transform = `translate(${tx},${ty})`;

            label = (
                <text {...textProps} transform={transform}>
                    {this.props.label}
                </text>
            );

            // By default, if a view generator is set, it takes precedence over any svg image url
            if (this.props.viewGenerator && !this.props.overrideGlobalViewGenerator) {
                node = (
                    <svg {...nodeProps} width={width} height={height}>
                        <foreignObject x="0" y="0" width="100%" height="100%">
                            <section style={{ height, width, backgroundColor: "transparent" }}>
                                {this.props.viewGenerator(this.props)}
                            </section>
                        </foreignObject>
                    </svg>
                );
            } else {
                node = <image {...nodeProps} href={this.props.svg} width={width} height={height} />;
            }

            // svg offset transform regarding svg width/height
            gtx -= tx;
            gty -= ty;
        } else {
            nodeProps.d = nodeHelper.buildSvgSymbol(size, this.props.type);
            nodeProps.fill = this.props.fill;
            nodeProps.stroke = this.props.stroke;
            nodeProps.strokeWidth = this.props.strokeWidth;
            label = <text {...textProps}>{this.props.label}</text>;
            node = (<foreignObject width="211" height="495" {...nodeProps}>

                <div className="Station">
                
                    <h1 className="title">{this.props.elementType}</h1>
                    <div className="infoBox">{this.props.distribution}({this.props.distributionParameters.join(", ")})</div>
                    <div className="infoBox">{this.props.queueType}</div>
                    <div className="infoBox">{this.props.numberOfActors} actors</div>
                    <div className="input-container">
                    <label style={{"text-align": "center"}}>queue</label>
                    <Queue className="infoBox" patients={patient_list} />
                    <label>processing</label>
                    <ResourceQueue className="infoBox"  patients={processing_list} />
                    </div>
                </div>
                
             </foreignObject>);
            // node = <path {...nodeProps} />;
        }

        const gProps = {
            className: this.props.className,
            cx: this.props.cx,
            cy: this.props.cy,
            id: this.props.id,
            transform: `translate(${gtx},${gty})`,
        };
        
        if(patient_list == null){
            console.log("ERROR")
        }
        return (
            <g {...gProps}>
                {node}
                
                {this.props.renderLabel && label}

            </g>
        );
    }
}
