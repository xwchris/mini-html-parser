import HTMLSyntacticalParser from './syntactical_parser';
import HTMLLexicalParser from './lexical_parser';

const html = `
  <div id="name">
    <p class="hello">nihao</p>
  </div>
`;

const lexicalParser = new HTMLLexicalParser(new HTMLSyntacticalParser());
lexicalParser.parse(html);
