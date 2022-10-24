import { toast } from "react-toastify";

const useToast = () => {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const notify = (type, message, options) => {
    switch (type) {
      case "success":
        toast.success(message, { ...toastOptions, ...options });
        break;
      case "error":
        toast.error(message, { ...toastOptions, ...options });
        break;
      default:
        console.log("Failed");
    }
  };

  return { notify };
};

export default useToast;
