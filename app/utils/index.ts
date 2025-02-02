export function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function cleanContent(str: string) {
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export function round(number: number, decimals: number = 2) {
  return Math.round(number * 10 ** decimals) / 10 ** decimals
}
