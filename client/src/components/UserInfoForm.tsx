import { ComponentPropsWithoutRef, FormEventHandler, forwardRef, useCallback } from "react";

import { Province, StudentData, isStudentData } from "@dohyunkim/common";
import type { WhoAmIQuery } from "src/graphql/graphql";

import Label from "./form/Label";
import PasswordInput from "./form/PasswordInput";

type RegisterFormPropsBase = Omit<ComponentPropsWithoutRef<"form">, "onSubmit">;

export interface RegisterFormProps extends RegisterFormPropsBase {
  user?: WhoAmIQuery["whoami"];
  disabled?: boolean | undefined;
  onSubmit?: (data?: StudentData) => void;
}

const UserInfoForm = forwardRef<HTMLFormElement, RegisterFormProps>((
  { user, disabled, onSubmit, children, ...props },
  ref,
) => {
  const submitHandler: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    if (!onSubmit) return;
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const idNumber = formData.get("id") || undefined;
    const email = formData.get("email") || undefined;
    const password = formData.get("password") || undefined;
    const firstName = formData.get("firstName") || undefined;
    const lastName = formData.get("lastName") || undefined;
    const phone = formData.get("phone") || undefined;
    const program = formData.get("program") || undefined;
    const street = formData.get("street") || undefined;
    const city = formData.get("city") || undefined;
    const province = formData.get("province") || undefined;
    const postalCode = formData.get("postalCode") || undefined;

    const data = {
      idNumber,
      email,
      password,
      firstName,
      lastName,
      phone: phone,
      program: program,
      address: {
        street: street ,
        city: city,
        province,
        postalCode: postalCode,
      },
    };
    onSubmit(isStudentData(data) ? data : undefined);
  }, [onSubmit]);

  return (
    <form ref={ref} onSubmit={submitHandler} {...props}>
      <fieldset className="list-group-item" disabled={disabled} aria-disabled={disabled}>
        <div className="container container-sm-max mt-3">
          <legend>Authentication Information</legend>
          <div className="mb-3">
            <Label htmlFor="user-id" className="form-label" required>Student ID</Label>
            <input
              type="text"
              name="id"
              id="user-id"
              className="form-control"
              defaultValue={user?.idNumber}
              pattern="[0-9]{9}"
              required
              readOnly={!!user}
              aria-readonly={!!user}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="user-email" className="form-label" required>Email Address</Label>
            <input
              type="email"
              name="email"
              id="user-email"
              className="form-control"
              defaultValue={user?.email}
              required
            />
          </div>
          { !user && (
            <div className="mb-3">
              <Label htmlFor="user-pw" className="form-label" required>Password</Label>
              <PasswordInput name="password" id="user-pw" className="form-control" required />
            </div>
          )}
        </div>
      </fieldset>
      <fieldset className="list-group-item" disabled={disabled} aria-disabled={disabled}>
        <div className="container container-sm-max mt-3">
          <legend>Student Information</legend>
          <div className="mb-3 row">
            <div className="col-12 col-sm-6 mb-3 mb-sm-0">
              <Label htmlFor="user-fname" className="form-label" required>First Name</Label>
              <input
                type="text"
                name="firstName"
                id="user-fname"
                className="form-control"
                defaultValue={user?.firstName}
                required
              />
            </div>
            <div className="col-12 col-sm-6 mb-3 mb-sm-0">
              <Label htmlFor="user-lname" className="form-label" required>Last Name</Label>
              <input
                type="text"
                name="lastName"
                id="user-lname"
                className="form-control"
                defaultValue={user?.lastName}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <Label htmlFor="user-phone" className="form-label">Phone</Label>
            <input
              type="tel"
              name="phone"
              id="user-phone"
              className="form-control"
              defaultValue={user?.phone ?? undefined}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="user-program" className="form-label">Program of Study</Label>
            <input
              type="text"
              name="program"
              id="user-program"
              className="form-control"
              defaultValue={user?.program ?? undefined}
            />
          </div>
        </div>
      </fieldset>
      <fieldset className="list-group-item" disabled={disabled} aria-disabled={disabled}>
        <div className="container container-sm-max mt-3">
          <legend>Address Information</legend>
          <div className="mb-3">
            <Label htmlFor="user-street" className="form-label">Street Address</Label>
            <input
              type="text"
              name="street"
              id="user-street"
              className="form-control"
              defaultValue={user?.address.street ?? undefined}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="user-city" className="form-label">City</Label>
            <input
              type="text"
              name="city"
              id="user-city"
              className="form-control"
              defaultValue={user?.address.city ?? undefined}
            />
          </div>
          <div className="mb-3 row">
            <div className="col-12 col-sm-6 mb-3 mb-sm-0">
              <Label htmlFor="user-province" className="form-label">Province</Label>
              <select
                name="province"
                id="user-province"
                className="form-select"
                defaultValue={user?.address.province || "ON"}
              >
                {Object.values(Province).map((prov) => (
                  <option value={prov} key={prov}>{prov}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-sm-6 mb-3 mb-sm-0">
              <Label htmlFor="user-postal" className="form-label">Postal Code</Label>
              <input
                type="text"
                name="postalCode"
                id="user-postal"
                className="form-control"
                defaultValue={user?.address.postalCode ?? undefined}
                pattern="[A-Z][0-9][A-Z]( )?[0-9][A-Z][0-9]"
              />
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
});

UserInfoForm.displayName = "UserInfoForm";
export default UserInfoForm;
