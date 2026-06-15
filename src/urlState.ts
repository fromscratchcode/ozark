import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

const CODE_PARAM = "c";
const CODEC_VERSION_PARAM = "cv";
const CODEC_VERSION = "1";

export const encodeCode = (str: string): string =>
  compressToEncodedURIComponent(str);

export const getCodeFromURL = (): string => {
  const params = new URLSearchParams(window.location.search);
  const codecVersion = params.get(CODEC_VERSION_PARAM);
  const encoded = params.get(CODE_PARAM);

  if (codecVersion !== CODEC_VERSION || !encoded) {
    return "";
  }

  return decompressFromEncodedURIComponent(encoded) ?? "";
};

export const setCodeInURL = (code: string): void => {
  const encoded = encodeCode(code);
  const params = new URLSearchParams(window.location.search);
  params.set(CODE_PARAM, encoded);
  params.set(CODEC_VERSION_PARAM, CODEC_VERSION);
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newURL);
};
