import { useEffect, useRef } from "react";

const useIsFirstRender = (): boolean => {
  const isFirst = useRef(true);

  useEffect(() => { isFirst.current = false; }, []);

  return isFirst.current;
};

export default useIsFirstRender;
