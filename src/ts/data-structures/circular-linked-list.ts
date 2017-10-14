import { defaultEquals, IEqualsFunction } from '../util';
import { Node } from './models/linked-list-models';

export default class CircularLinkedList<T> {
  private count = 0;
  private head: Node<T> | undefined;

  constructor(private equalsFn: IEqualsFunction<T> =  defaultEquals) { }

  private getLastElement() {
    let current = this.head;
    for (let i = 2; i <= this.size() && current; i++) {
      current = current.next;
    }
    return current;
  }

  push(element: T) {
    const node = new Node(element);
    let current;

    if (this.head === undefined || this.head === null) {
      this.head = node;
    } else {
      current = this.getLastElement();
      if (current) {
        current.next = node;
      }
    }

    // set node.next to head - to have circular list
    node.next = this.head;

    this.count++;
  }

  getElementAt(index: number) {
    if (index >= 0 && index <= this.count) {
      let node = this.head;
      for (let i = 0; i < index; i++) {
        if (node) {
          node = node.next;
        }
      }
      return node;
    }
    return undefined;
  }

  insert(index: number, element: T) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element);
      let current = this.head;

      if (index === 0) {
        if (!this.head) {
          // if no node  in list
          this.head = node;
          node.next = this.head;
        } else {
          node.next = current;
          current = this.getLastElement();
          // update last element
          this.head = node;
          if (current) {
            current.next = this.head;
          }
        }
      } else {
        const previous = this.getElementAt(index - 1);
        if (previous) {
          node.next = previous.next;
          previous.next = node;
        }
      }
      this.count++;
      return true;
    }
    return false;
  }

  removeAt(index: number) {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      if (index === 0) {
        const removed = this.head;

        if (this.size() === 1) {
          this.head = undefined;
        } else {
          current = this.getLastElement();
          if (this.head) {
            this.head = this.head.next;
          }
          if (current) {
            current.next = this.head;
          }
          current = removed;
        }
      } else {
        // no need to update last element for circular list
        const previous = this.getElementAt(index - 1);
        if (previous) {
          current = previous.next;
          if (current) {
            previous.next = current.next;
          }
        }
      }
      if (current) {
        this.count--;
        return current.element;
      }
    }
    return undefined;
  }

  remove(element: T) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }

  indexOf(element: T) {
    let current = this.head;

    for (let i = 1; i <= this.size() && current; i++) {
      if (this.equalsFn(element, current.element)) {
        return i - 1;
      }
      current = current.next;
    }

    return -1;
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.count;
  }

  getHead() {
    return this.head;
  }

  clear() {
    this.head = undefined;
    this.count = 0;
  }

  toString() {
    if (this.head === undefined) {
      return '';
    }
    let objString = `${this.head.element}`;
    let current = this.head.next;
    for (let i = 2; i <= this.size() && current; i++) {
      objString = `${objString},${current.element}`;
      current = current.next;
    }
    return objString;
  }
}
