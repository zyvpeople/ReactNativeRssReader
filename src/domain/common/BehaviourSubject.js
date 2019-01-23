export default class BehaviourSubject {
  constructor(value) {
    this.value = value
    this.observers = []
  }

  subscribe(observer) {
    this.observers.push(observer)
    observer(this.value)
    return () => {
      this.observers = this.observers.filter((it) => it !== observer);
    }
  }

  onNext(value) {
    this.value = value
    this.observers.forEach((it) => it(value))
  }
}
