import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './BillNode.css';

const BillNode = ({ data, selected }) => {
  // Extract amount from label if present (e.g. "Netflix (-$15/mo)")
  let displayLabel = data.label;
  let amount = null;
  
  if (data.label && data.label.includes('(-$')) {
      const parts = data.label.split('(');
      displayLabel = parts[0].trim();
      amount = parts[1].replace(')', '');
  }

  return (
    <div className={`bill-node-wrapper ${selected ? 'selected' : ''} ${data.isDrifting ? 'drifting' : ''}`}>
      {/* Input Handle (Top) */}
      <Handle type="target" position={Position.Top} className="bill-handle" />

      <div className="bill-node-content">
        <div className="bill-icon-section">
            <span className="bill-icon">🧾</span>
        </div>
        <div className="bill-text-section">
            <span className="bill-name" title={displayLabel}>{displayLabel}</span>
            {amount && <span className="bill-amount">{amount}</span>}
        </div>
      </div>

      {/* Output Handle (Bottom) */}
      <Handle type="source" position={Position.Bottom} className="bill-handle" />
    </div>
  );
};

export default memo(BillNode);
