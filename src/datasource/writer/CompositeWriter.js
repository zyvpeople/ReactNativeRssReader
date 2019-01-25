export default class CompositeWriter {

  constructor(writers) {
    this.writers = writers
  }

  write(message) {
    this.writers.forEach(writer => writer.write(message))
  }
}
