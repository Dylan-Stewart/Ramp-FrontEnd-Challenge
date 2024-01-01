import React, { useState } from "react";
import { InputCheckbox } from "../InputCheckbox";
import { SetTransactionApprovalFunction } from "./types"; // CHANGED moved Transaction import down
import { Transaction } from "src/utils/types"; // ADDED incorrectly imported

export const TransactionPane: React.FC<{
  transaction: Transaction;
  loading: boolean;
  isChecked: boolean; // ADDED receives the initial checkbox state
  setTransactionApproval: SetTransactionApprovalFunction;
  updateCheckboxState: (id: string, value: boolean) => void;
}> = ({ transaction, loading, isChecked, setTransactionApproval, updateCheckboxState }) => {
  const [approved, setApproved] = useState(isChecked); // CHANGED initial state value

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={async (newValue) => {
          await setTransactionApproval({ // CHANGED to use newValue instead of value
            transactionId: transaction.id,
            newValue,
          });

          setApproved(newValue); // CHANGED update state when checkbox changes
          updateCheckboxState(transaction.id, newValue);
        }}
      />
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
