import { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@fluentui/react-components";
import { ArrowCounterclockwiseRegular } from "@fluentui/react-icons";
import { useLayoutCustomization } from "./LayoutCustomizationContext.jsx";

export default function LayoutMasterReset() {
  const { editMode, resetAllLayouts, layouts } = useLayoutCustomization();
  const [open, setOpen] = useState(false);

  const hasSavedChanges = Object.keys(layouts).length > 0;

  if (!editMode) {
    return null;
  }

  const handleConfirm = () => {
    resetAllLayouts();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="layout-master-reset"
        onClick={() => setOpen(true)}
        disabled={!hasSavedChanges}
        title={
          hasSavedChanges
            ? "Reset all list and form layout changes"
            : "No saved layout changes to reset"
        }
        aria-haspopup="dialog"
      >
        <ArrowCounterclockwiseRegular className="layout-master-reset__icon" aria-hidden="true" />
        <span>Reset all layouts</span>
      </button>

      <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <DialogSurface className="layout-master-reset-dialog" aria-describedby="layout-master-reset-desc">
          <DialogBody className="layout-master-reset-dialog__body">
            <DialogTitle className="layout-master-reset-dialog__title">
              Reset all layout changes?
            </DialogTitle>
            <DialogContent className="layout-master-reset-dialog__content">
              <p id="layout-master-reset-desc" className="layout-master-reset-dialog__text">
                This will restore every list column order and detail form layout to the app defaults
                for all entities. Your custom fields and cards will be removed. This cannot be undone.
              </p>
            </DialogContent>
            <div className="layout-master-reset-dialog__actions">
              <Button
                type="button"
                appearance="outline"
                className="layout-master-reset-dialog__btn layout-master-reset-dialog__btn--cancel"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                appearance="primary"
                className="layout-master-reset-dialog__btn layout-master-reset-dialog__btn--confirm"
                onClick={handleConfirm}
              >
                Reset all
              </Button>
            </div>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
