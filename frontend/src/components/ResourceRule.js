import React from 'react';
import Rule from './Rule';

const ResourceRule = ({ ruleType, nodeId, definedFunction, onDropdownChange, onInputChange, removeRule }) => <Rule
        name="resourceRules"
        ruleType={ruleType}
        nodeId={nodeId}
        definedFunction={definedFunction}
        onDropdownChange={onDropdownChange}
        onInputChange={onInputChange}
        removeRule={removeRule}
    >
        <option value="firstComeFirstServe">First Come First Serve</option>
        <option value="requiresNode">Requires Node</option>
        <option value="defineYourOwn">Define Your Own</option>
    </Rule>;

export default ResourceRule;