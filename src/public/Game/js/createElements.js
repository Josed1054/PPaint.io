export class NewElement {
  constructor(clsNm, element, father, inner) {
    this.clsNm = clsNm;
    this.element = element;
    this.father = father;
    this.inner = inner;
  }

  addElement() {
    const newElement = document.createElement(`${this.element}`);
    newElement.className = `${this.clsNm}`;

    const fatherElement = document.querySelector(`${this.father}`);
    fatherElement.appendChild(newElement);
  }

  addElementAndInnerText() {
    const newElement = document.createElement(`${this.element}`);
    newElement.className = `${this.clsNm}`;

    newElement.innerText = `${this.inner}`;

    const fatherElement = document.querySelector(`${this.father}`);
    fatherElement.appendChild(newElement);
  }
}
