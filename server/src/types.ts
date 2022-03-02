import type { Types } from "mongoose";

export type IdType = string | Types.ObjectId;

export type DataWithFlag<
  T,
  FlagKey extends Exclude<string, "data"> = "success",
  FlagValue = boolean,
> = { data: T } & { [P in FlagKey]: FlagValue; };
