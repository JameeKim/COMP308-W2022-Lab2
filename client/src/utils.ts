/**
 * Check if the value is an abort error and do a type cast
 */
export const isAbortError = (error: unknown): DOMException | false => {
  const isIt = error instanceof DOMException && error.code === DOMException.ABORT_ERR;
  return isIt ? error : false;
};
