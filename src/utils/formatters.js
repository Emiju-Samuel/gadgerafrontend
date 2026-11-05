const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export const formatCurrency = (value) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return currencyFormatter.format(0)
  return currencyFormatter.format(amount)
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const formatDate = (value) => {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateFormatter.format(date)
}

export const formatDateTime = (value) => {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateTimeFormatter.format(date)
}

/**
 * The backend serialises product images (byte[]) as base64 strings.
 * Returns a usable <img src> or null when there is no image.
 */
export const getProductImageUrl = (byteImg) => {
  if (!byteImg) return null
  if (typeof byteImg !== 'string') return null
  if (byteImg.startsWith('data:') || byteImg.startsWith('http')) return byteImg
  return `data:image/jpeg;base64,${byteImg}`
}

export const formatStatusLabel = (status) => {
  if (!status) return ''
  return String(status)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
}
