export function formatClassNameToUrl(className: string) {
  return className.toLowerCase().replace(/_/g, "-");
}

export function parseUrlToClassName(urlParam: string) {
  return urlParam.toUpperCase().replace(/-/g, "_");
}
