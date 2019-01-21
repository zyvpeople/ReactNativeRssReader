export default class Observable {
  constructor() {
    this.observers = []
  }

  subscribe(observer) {
    this.observers.push(observer)
    return () => {
      this.observers = this.observers.filter((it) => it !== observer);
    }
  }

  onNext(value) {
    this.observers.forEach((it) => it(value))
  }
}
