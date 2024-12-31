export const toNumber = (value?: string | number, defaultValue?: number) => {
  if (!value) {
    return defaultValue
  }
  if (typeof value === 'number') {
    return value
  }
  try {
    const numberVal = Number.parseFloat(value)
    return typeof numberVal === 'number' ? numberVal : defaultValue
  } catch (_) {
    return defaultValue
  }
}
