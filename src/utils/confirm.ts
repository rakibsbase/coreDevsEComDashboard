import Swal from "sweetalert2";

const PRIMARY = "#7C3AED";
const CANCEL = "#6B7280";

export const confirmDelete = (itemName: string): Promise<boolean> =>
  Swal.fire({
    title: `Delete ${itemName}?`,
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: PRIMARY,
    cancelButtonColor: CANCEL,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-xl"
    }
  }).then((result) => result.isConfirmed);

export const confirmSave = (itemName = "changes"): Promise<boolean> =>
  Swal.fire({
    title: "Save Changes?",
    text: `Save ${itemName}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: PRIMARY,
    cancelButtonColor: CANCEL,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-xl"
    }
  }).then((result) => result.isConfirmed);

export const confirmAction = (title: string, text: string): Promise<boolean> =>
  Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: PRIMARY,
    cancelButtonColor: CANCEL,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-xl"
    }
  }).then((result) => result.isConfirmed);

export const toastSuccess = (message: string): Promise<unknown> =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

export const toastError = (message: string): Promise<unknown> =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 3500
  });
