export const encodeCode = (str: string): string =>
  btoa(encodeURIComponent(str));

const decode = (str: string): string => {
  try {
    return decodeURIComponent(atob(str));
  } catch {
    return "";
  }
};

export const getCodeFromURL = (): string => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("code");
  return encoded ? decode(encoded) : "";
};

export const setCodeInURL = (code: string): void => {
  const encoded = encodeCode(code);
  const params = new URLSearchParams(window.location.search);
  params.set("code", encoded);
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newURL);
};
