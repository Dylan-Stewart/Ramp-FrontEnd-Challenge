import React, { useCallback, useState } from "react";
import { useCustomFetch } from "src/hooks/useCustomFetch";
import { SetTransactionApprovalParams, Transaction } from "src/utils/types";
import { TransactionPane } from "./TransactionPane";

export const Transactions: React.FC<{ transactions: Transaction[] | null }> = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch();

  // ADDED tracks checkbox states for each transaction
  const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>({});

  const setTransactionApproval = useCallback(
    async ({ transactionId, newValue }: SetTransactionApprovalParams) => {
      // ADDED call the API to update transaction approval
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        newValue,
      });

      // CHANGED update checkbox state in local state
      setCheckboxStates((prevStates) => ({ ...prevStates, [transactionId]: newValue }));
    },
    [fetchWithoutCache]
  );

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>;
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          // CHANGED passes checkbox state from local state to the TransactionPane
          isChecked={checkboxStates[transaction.id] || false}
          setTransactionApproval={setTransactionApproval}
          // CHANGED passes the function to update checkbox state to TransactionPane
          updateCheckboxState={(id, value) => setCheckboxStates((prevStates) => ({ ...prevStates, [id]: value }))}
        />
      ))}
    </div>
  );
};
