import classNames from "classnames";
import { useEffect, useState } from "react";

import useIsFirstRender from "src/hooks/useIsFirstRender";

export interface PageLoadingProps {
  show?: boolean;
  spinnerSize?: number;
}

const FADE_TIME = 200; // ms

export default function PageLoading({
  show = true,
  spinnerSize = 5,
}: PageLoadingProps): JSX.Element | null {
  const [display, setDisplay] = useState(show);
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (isFirstRender) return;
    if (show) return setDisplay(true);

    // transition of hide -> show
    const handle = setTimeout(() => setDisplay(false), FADE_TIME);

    return () =>clearTimeout(handle);
  }, [isFirstRender, show]);

  const classes = "modal-backdrop fade d-flex justify-content-center align-items-center";
  const transition = `opacity ${FADE_TIME}ms linear`;
  const spinner = `${Math.max(spinnerSize, 0)}rem`;

  return (display || null) && (
    <div
      tabIndex={-1}
      className={classNames(classes, { show })}
      aria-hidden={!show}
      style={{ transition, overflowY: "auto" }}
    >
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: spinner, height: spinner }}
      >
        <span className="visually-hidden">Loading Page...</span>
      </div>
    </div>
  );
}
