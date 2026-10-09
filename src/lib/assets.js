// GitHub project sites live below /repository/, rather than the domain root.
export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
