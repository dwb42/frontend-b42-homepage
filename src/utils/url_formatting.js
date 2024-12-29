
export function urlRules(value) {
  if (!value) return 'URL is required'
  if (!isValidURL(value)) return 'Please enter a valid URL'
  return true
}

export function isValidURL(url) {
  try {
    new URL(url)
    return true
  } catch {
    try {
      new URL('https://' + url)
      return true
    } catch {
      return false
    }
  }
}

export function formatURL(url) {
  if (!url) return url

  let formattedUrl = url.trim()

  // If URL doesn't start with protocol, add https://
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl
  }

  // Return the URL if it's valid
  try {
    new URL(formattedUrl)
    return formattedUrl
  } catch {
    return url // Return original if invalid
  }
}
