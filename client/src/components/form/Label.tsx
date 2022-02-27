import { ComponentPropsWithoutRef, forwardRef } from "react";

export interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  required?: boolean | undefined;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ required, children, ...props }, ref) => {
  return (
    <label ref={ref} {...props}>
      {children}
      {required && (<>{" "}<small>(required)</small></>)}
    </label>
  );
});

Label.displayName = "Label";
export default Label;
