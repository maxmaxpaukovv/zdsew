import React, { useState } from 'react'
import { HierarchicalOrderGroup } from '../../types/financialHierarchy'
import { CollapsibleHeader, FinancialTotals } from './shared'
import { WorkGroup } from './WorkGroup'

interface OrderGroupProps {
  order: HierarchicalOrderGroup
  onItemQuantityChange: (itemId: string, newQuantity: number) => void
  onSelectMotor: (itemId: string) => void
}

export const OrderGroup: React.FC<OrderGroupProps> = ({
  order,
  onItemQuantityChange,
  onSelectMotor,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="bg-blue-50 p-3 rounded-lg shadow-sm border-2 border-blue-200 mb-4">
      <CollapsibleHeader
        isExpanded={isExpanded}
        toggle={() => setIsExpanded(!isExpanded)}
        className="hover:bg-blue-100 rounded"
      >
        <div className="flex items-center gap-3 flex-grow min-w-0">
          <span className="flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
            {order.orderNumber || '#'}
          </span>
          <h2 className="text-base font-bold text-gray-900 truncate">
            {order.orderName || 'Заказ без названия'}
          </h2>
        </div>
        <FinancialTotals
          income={order.totalIncome}
          expense={order.totalExpense}
          profit={order.totalProfit}
        />
      </CollapsibleHeader>

      {isExpanded && (
        <div className="mt-3 ml-6 space-y-2">
          {order.workGroups.map((wg) => (
            <WorkGroup
              key={wg.id}
              group={wg}
              onItemQuantityChange={onItemQuantityChange}
              onSelectMotor={onSelectMotor}
            />
          ))}
        </div>
      )}
    </div>
  )
}
