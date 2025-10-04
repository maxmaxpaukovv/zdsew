import React, { useState } from 'react'
import { HierarchicalPositionGroup } from '../../types/financialHierarchy'
import { CollapsibleHeader, FinancialTotals } from './shared'
import { TransactionTypeGroup } from './TransactionTypeGroup'

interface PositionGroupProps {
  group: HierarchicalPositionGroup
  onItemQuantityChange: (itemId: string, newQuantity: number) => void
  onSelectMotor: (itemId: string) => void
}

export const PositionGroup: React.FC<PositionGroupProps> = ({
  group,
  onItemQuantityChange,
  onSelectMotor,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-sm">
      <CollapsibleHeader
        isExpanded={isExpanded}
        toggle={() => setIsExpanded(!isExpanded)}
        className="bg-gray-50 hover:bg-gray-100 rounded-md"
      >
        <h3 className="text-sm font-semibold text-gray-800 truncate pl-2">
          {group.baseItemName}
        </h3>
        <FinancialTotals
          income={group.totalIncome}
          expense={group.totalExpense}
          profit={group.totalProfit}
        />
      </CollapsibleHeader>

      {isExpanded && (
        <div className="py-2 ml-6 space-y-2">
          <TransactionTypeGroup
            group={group.incomeGroup}
            onItemQuantityChange={onItemQuantityChange}
            onSelectMotor={onSelectMotor}
          />
          <TransactionTypeGroup
            group={group.expenseGroup}
            onItemQuantityChange={onItemQuantityChange}
            onSelectMotor={onSelectMotor}
          />
        </div>
      )}
    </div>
  )
}
