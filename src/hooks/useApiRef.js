import { useRef, useMemo } from "react";

function useApiRef(columnss) {
  const apiRef = useRef(null);
  const _columns = useMemo(
    () =>
      columnss.concat({
        field: "__HIDDEN__",
        width: 0,
        renderCell: (params) => {
          apiRef.current = params.api;
          return null;
        },
      }),
    [columnss]
  );

  return { apiRef, columns: _columns };
}

export default useApiRef;
