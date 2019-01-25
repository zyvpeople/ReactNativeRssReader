export default class Logger {

  constructor(debugWriter, errorWriter) {
    this.debugWriter = debugWriter
    this.errorWriter = errorWriter
  }

  d(tag, message) {
    this.debugWriter.write(`Debug. Tag: ${tag}. Message: ${message}`)
  }

  e(tag, message, error) {
    this.errorWriter.write(`Error. Tag: ${tag}. Message: ${message}. Error: ${error}`)
  }
}
