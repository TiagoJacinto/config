/* eslint-disable @typescript-eslint/no-unused-vars */
class SortedClass {
  static {}

  static {}

  static {}

  prop1 = 0;
  prop2 = 2;

  static method1() {}

  static method2() {}

  static method3() {}

  private privateMethod1() {}

  private privateMethod2() {
    throw new Error();
  }

  publicMethod1() {}

  publicMethod2() {
    return '';
  }

  get getter1() {
    return this.prop1;
  }

  set setter1(value: number) {
    this.prop1 = value;
  }
}
