export default class FetchHttpClient {

  get(url, headers) {
    let requestHeaders = new Headers()
    for (var [key, value] of headers) {
      requestHeaders.append(key, value)
    }
    return fetch(
      url,
      {
        method: 'GET',
        headers: requestHeaders
      })
      .then(response => response.text())
  }
}
