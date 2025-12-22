import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './BillNode.css'; // Re-use bill styles for consistency, add group specific later if needed

const BillGroupNode = ({ data, selected }) => {
  const count = data.billCount || 0;
  const total = data.totalAmount || 0;
  const label = data.label || 'Bill Group';

  return (
    <div className={`bill-node-wrapper group-node ${selected ? 'selected' : ''}`}>
      {/* Input Handle (Top) */}
      <Handle type="target" position={Position.Top} className="bill-handle" />

      <div className="bill-node-content group-content">
        <div className="bill-icon-section group-icon">
            <span className="bill-icon">📂</span>
        </div>
        <div className="bill-text-section">
            <span className="bill-name font-bold">{label}</span>
            <span className="bill-amount text-xs text-gray-300">{count} Bills • ${Math.round(total).toLocaleString()}</span>
        </div>
        {/* Expand/Pop Button - handled via click on node in main flow, or we can add a specific action button here */}
        <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-white border border-white shadow-sm">
            {count}
        </div>
      </div>

      {/* Output Handle (Bottom) */}
      <Handle type="source" position={Position.Bottom} className="bill-handle" />
    </div>
  );
};

export default memo(BillGroupNode);
