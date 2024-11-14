import "./DeleteConfirmation.css"

function deletePortfolioProcess(stockValue,onConfirm, onCancel){
    const formattedStockValue = stockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (
        <div className="delete-modal-container" data-testid='delete-review-modal'>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this portfolio?</p>
            <p>Portfolio worths $ {formattedStockValue}</p>
            <button className="delete-yes" onClick={onConfirm} data-testid='confirm-delete-review-button'>Yes (Delete Portfolio)</button>
            <button className="delete-no" onClick={onCancel} data-testid='cancel-delete-review-button'>No (Keep Portfolio)</button>
        </div>
    )
}

export default  function ConfirmDeleteModal({stockValue, onConfirm, onCancel}) {
    let response;
    response = deletePortfolioProcess(stockValue,onConfirm, onCancel)
    return response;
}