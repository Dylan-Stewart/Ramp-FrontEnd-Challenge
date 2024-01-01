import {
  PaginatedRequestParams,
  PaginatedResponse,
  RequestByEmployeeParams,
  SetTransactionApprovalParams,
  Transaction,
  Employee,
} from "./types"
import mockData from "../mock-data.json"

const TRANSACTIONS_PER_PAGE = 5

const data: { employees: Employee[]; transactions: Transaction[] } = {
  employees: mockData.employees,
  transactions: mockData.transactions,
}

export const getEmployees = (): Employee[] => data.employees

export const getTransactionsPaginated = ({
  page,
}: PaginatedRequestParams): PaginatedResponse<Transaction[]> => {
  if (page === null) {
    throw new Error("Page cannot be null");
  }

  const start = page * TRANSACTIONS_PER_PAGE;
  const end = start + TRANSACTIONS_PER_PAGE;

  if (start > data.transactions.length) {
    throw new Error(`Invalid page ${page}`);
  }

  const nextPage = end < data.transactions.length ? page + 1 : null;

  /* Combine existing transactions with new transactions <----ADDED */
  const newData = page === 0 ? data.transactions.slice(start, end) : [...data.transactions, ...data.transactions.slice(start, end)]; // <----ADDED

  return {
    nextPage,
    data: newData, // ADDED
  };
};

export const getTransactionsByEmployee = ({ employeeId }: RequestByEmployeeParams) => {
  if (!employeeId) {
    return data.transactions /* ADDED */
    /* throw new Error("Employee id cannot be empty")  <----REMOVED */
  }

  return data.transactions.filter((transaction) => transaction.employee.id === employeeId)
}

export const setTransactionApproval = ({ transactionId, newValue }: SetTransactionApprovalParams): void => { // CHANGED to use newValue instead of value
  const transaction = data.transactions.find(
    (currentTransaction) => currentTransaction.id === transactionId
  )

  if (!transaction) {
    throw new Error("Invalid transaction to approve")
  }

  transaction.approved = newValue // CHANGED to use newValue instead of value
}
