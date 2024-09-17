
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SWAL_TIMEOUTS = {
  DEFAULT: 6000,
  SUCCESS: 5000,
  ERROR: 5000,
};

const SWAL_ICONS = {
  SUCCESS: 'success' as SweetAlertIcon,
  ERROR: 'error' as SweetAlertIcon,
  WARNING: 'warning' as SweetAlertIcon,
  INFO: 'info' as SweetAlertIcon,
  QUESTION: 'question' as SweetAlertIcon,
};

const SWAL_CSS_ICON = {
  SUCCESS: 'swal-icon-success' as SweetAlertIcon,
  ERROR: 'swal-icon-error' as SweetAlertIcon,
  WARNING: 'swal-icon-warning' as SweetAlertIcon,
  INFO: 'swal-icon-info' as SweetAlertIcon,
  QUESTION: 'swal-icon-question' as SweetAlertIcon
};

const swalReactContent = (
  title: string,
  text: string,
  swalIcon: SweetAlertIcon,
  cssIconStyle: SweetAlertIcon,
  confirmButtonText: string | undefined,
  cancelButtonText: string | undefined,
  timeout: number | undefined,
  callbackConfirm: () => void,
  callbackAfterTimer: (() => void) | undefined
) => {
  withReactContent(Swal).fire({
    title,
    text,
    icon: swalIcon,
    customClass: {
      confirmButton: 'btn-purple-1',
      cancelButton: 'btn-purple-2',
      icon: cssIconStyle,
    },
    confirmButtonText,
    cancelButtonText,
    allowOutsideClick: false,
    showConfirmButton: Boolean(confirmButtonText),
    showCancelButton: Boolean(cancelButtonText),
    timer: timeout,
  }).then(function (result) {
    if (result.isConfirmed) {
      // Si confirma
      callbackConfirm();
    } else if (result.isDenied) {
      // Si cancela
      Swal.clickCancel();
    } else if (result.dismiss === Swal.DismissReason.timer && callbackAfterTimer) {
      // Despues del timer
      callbackAfterTimer();
    } else {
      // No se hace nada
    }
  });
};

const errorSwal = (
  title: string,
  text: string,
  confirmButtonText: string | undefined,
  callbackConfirm: () => void
) => {
  swalReactContent(
    title,
    text,
    SWAL_ICONS.ERROR,
    SWAL_CSS_ICON.ERROR,
    confirmButtonText,
    undefined,
    SWAL_TIMEOUTS.ERROR,
    callbackConfirm,
    undefined
  );
}

const successSwal = (
  title: string,
  text: string,
  confirmButtonText: string,
  callbackConfirm: () => void,
  callbackAfterTimer: () => void
) => {
  swalReactContent(
    title,
    text,
    SWAL_ICONS.SUCCESS,
    SWAL_CSS_ICON.SUCCESS,
    confirmButtonText,
    undefined,
    SWAL_TIMEOUTS.SUCCESS,
    callbackConfirm,
    callbackAfterTimer
  );
};

const warningSwal = (
  title: string,
  text: string,
  confirmButtonText: string,
  callbackConfirm: () => void
) => {
  swalReactContent(
    title,
    text,
    SWAL_ICONS.WARNING,
    SWAL_CSS_ICON.WARNING,
    confirmButtonText,
    undefined,
    SWAL_TIMEOUTS.DEFAULT,
    callbackConfirm,
    undefined
  );
};

const infoSwal = (
  title: string,
  text: string,
  confirmButtonText: string,
  cancelButtonText: string,
  callbackConfirm: () => void
) => {
  swalReactContent(
    title,
    text,
    SWAL_ICONS.INFO,
    SWAL_CSS_ICON.INFO,
    confirmButtonText,
    cancelButtonText,
    undefined,
    callbackConfirm,
    undefined
  );
}

export const SwalUtils = {
  errorSwal,
  successSwal,
  warningSwal,
  infoSwal,
};
