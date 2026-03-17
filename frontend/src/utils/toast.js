import { toast } from "react-toastify";

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-right",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

    export {handleSuccess, handleError}