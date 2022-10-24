import { useEffect } from "react";

const useDocTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title}`;
    } else {
      document.title = "X-Beat | The Perfect Audio Store";
    }
  }, [title]);

  return null;
};

export default useDocTitle;
