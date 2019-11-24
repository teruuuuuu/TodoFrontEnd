
export class Card {
  id: number
  title: string
  firstName: string
  lastName: string
  txt: string

  constructor(id: number, title: string, firstName: string, lastName: string, txt: string) {
    this.id = id;
    this.title = title;
    this.firstName = firstName;
    this.lastName = lastName;
    this.txt = txt;
  }
}
