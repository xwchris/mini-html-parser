import HTMLSyntacticalParser from './syntactical_parser';

type State = (char: string) => State | void;

export type Token = StartTagToken | EndTagToken | Attribute | string;

class StartTagToken {
  type = 'START_TAG';
  name = '';
}

class EndTagToken {
  type = 'END_TAG';
  name = '';
}

class Attribute {
  type = 'ATTRIBUTE';
  name = '';
  value = '';
}

let token: StartTagToken | EndTagToken;
let attribute: Attribute;

class HTMLLexicalParser {
  syntacticalParser: HTMLSyntacticalParser;
  state: State | void = this.data;

  constructor(syntacticalParser: HTMLSyntacticalParser) {
    this.syntacticalParser = syntacticalParser;
  }

  parse(str: string) {
    for (let char of str) {
      if (this.state != undefined) {
        this.state = this.state(char);
      }
    }
  }

  data(char: string): State {
    if (char === '<') {
      return this.tagOpen;
    }

    this.emitToken(char);
    return this.data;
  }

  tagOpen(char: string): State | void {
    if (char === '/') {
      return this.endTagOpen;
    } else if (/[a-zA-Z]/.test(char)) {
      token = new StartTagToken();
      token.name = char.toLowerCase();
      return this.tagName;
    }

    return this.error(char);
  }

  tagName(char: string): State | void {
    if (char === '/') {
      this.emitToken(token);
      return this.selfClosing;
    } else if (char === '>') {
      this.emitToken(token);
      return this.data;
    } else if (char === ' ') {
      this.emitToken(token);
      return this.beforeAttributeName;
    } else if (/[a-zA-Z]/.test(char)) {
      token.name += char;
      return this.tagName;
    }

    return this.error(char);
  }

  endTagOpen(char: string): State | void {
    if (/[a-zA-Z]/.test(char)) {
      token = new EndTagToken();
      token.name = char.toLowerCase();
      return this.tagName;
    }

    return this.error(char);
  }

  beforeAttributeName(char: string): State | void {
    if (/[a-zA-Z]/.test(char)) {
      attribute = new Attribute();
      attribute.name = char;
      return this.attributeName;
    } else if (char === '/') {
      return this.selfClosing;
    } else if (char === '>') {
      return this.data;
    }

    return this.error(char);
  }

  attributeName(char: string): State | void {
    if (char === '=') {
      return this.beforeAttributeValue;
    } else if (/[a-zA-Z]/.test(char)) {
      attribute.name += char;
      return this.attributeName;
    }

    return this.error(char);
  }

  beforeAttributeValue(char: string): State | void {
    if (/[a-zA-Z]/.test(char)) {
      attribute.value = char;
      return this.attributeValue;
    } else if (/['"']/.test(char)) {
      return this.attributeValue;
    }

    return this.error(char);
  }

  attributeValue(char: string): State | void {
    if (/[a-zA-Z]/.test(char)) {
      attribute.value += char;
      return this.attributeValue;
    } else if (char === '>') {
      this.emitToken(attribute);
      return this.data;
    } else if (/[\s'"]/.test(char)) {
      this.emitToken(attribute);
      return this.beforeAttributeName;
    }

    return this.error(char);
  }

  selfClosing(char: string): State | void {
    if (char === '>') {
      return this.data;
    }

    return this.error(char);
  }

  emitToken(token: Token) {
    this.syntacticalParser.receiveInput(token);
  }

  error(char: string) {
    console.error('Invalid char', char);
  }
}

export default HTMLLexicalParser;
