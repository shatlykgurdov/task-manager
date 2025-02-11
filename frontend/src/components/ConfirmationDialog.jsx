import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const ConfirmationDialog = ({ visible, onHide, onConfirm }) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Confirm Deletion"
      modal
      footer={
        <div>
          <Button label="No" icon="pi pi-times" className="p-button-text" onClick={onHide} />
          <Button label="Yes" icon="pi pi-check" className="p-button-danger" onClick={onConfirm} />
        </div>
      }
    >
      <p>Are you sure you want to delete this task?</p>
    </Dialog>
  );
};

export default ConfirmationDialog;
