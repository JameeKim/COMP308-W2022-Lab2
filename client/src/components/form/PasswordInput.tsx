import { ComponentPropsWithoutRef, forwardRef, useCallback, useState } from "react";

type PasswordInputProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "autoComplete">;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [show, setShow] = useState(false);

  const onShowToggle = useCallback((): void => setShow(!show), [show]);

  return (
    <div className="input-group">
      <input type={show ? "text" : "password"} ref={ref} autoComplete="false" {...props} />
      <button type="button" className="btn btn-outline-secondary" onClick={onShowToggle}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
