import { Token } from './lexical_parser';

class HTMLSyntacticalParser {
  receiveInput(token: Token) {
    console.log(token);
  }
}

export default HTMLSyntacticalParser;
