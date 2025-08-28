from flask import Flask, Response, request, jsonify
import json
import sys
import os

# Add the project root to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import your lexical analyzer code here
# If you have separate modules, you'll need to copy them into the api/ directory
# or adjust the imports accordingly

# Sample lexical analyzer class implementations (replace with your actual code)
class Token:
    def __init__(self, type, value, position):
        self.type = type
        self.value = value
        self.position = position
    
    def to_dict(self):
        return {
            'type': self.type,
            'value': self.value,
            'position': self.position
        }

class Lexer:
    def __init__(self, text):
        self.text = text
        self.pos = 0
        self.current_char = self.text[self.pos] if text else None
        self.line = 1
        self.column = 1

    def tokenize(self):
        tokens = []
        while self.current_char is not None:
            if self.current_char.isspace():
                self.advance()
                continue
            elif self.current_char.isalnum():
                tokens.append(self.identifier())
            elif self.current_char == '+':
                tokens.append(Token('PLUS', '+', [self.line, self.column]))
                self.advance()
            elif self.current_char == '*':
                tokens.append(Token('MULT', '*', [self.line, self.column]))
                self.advance()
            elif self.current_char == '(':
                tokens.append(Token('LPAREN', '(', [self.line, self.column]))
                self.advance()
            elif self.current_char == ')':
                tokens.append(Token('RPAREN', ')', [self.line, self.column]))
                self.advance()
            else:
                raise Exception(f"Invalid character: '{self.current_char}' at position {self.line}:{self.column}")
        return tokens

    def identifier(self):
        result = ''
        position = [self.line, self.column]
        while self.current_char is not None and self.current_char.isalnum():
            result += self.current_char
            self.advance()
        return Token('ID', result, position)

    def advance(self):
        if self.current_char == '\n':
            self.line += 1
            self.column = 0
        self.column += 1
        self.pos += 1
        if self.pos < len(self.text):
            self.current_char = self.text[self.pos]
        else:
            self.current_char = None

class SymbolTable:
    def __init__(self):
        self.symbols = {}
    
    def add_symbol(self, token):
        if token.value not in self.symbols:
            self.symbols[token.value] = {
                'type': token.type,
                'value': token.value,
                'first_position': token.position,
                'occurrences': 1,
                'scope': 'global'
            }
        else:
            self.symbols[token.value]['occurrences'] += 1
    
    def get_table(self):
        return self.symbols

class Node:
    def __init__(self, name, value=None, children=None):
        self.name = name
        self.value = value
        self.children = children or []
    
    def to_dict(self):
        return {
            'name': self.name,
            'value': self.value,
            'children': [child.to_dict() for child in self.children]
        }

class Parser:
    def __init__(self, lexer, symbol_table):
        self.lexer = lexer
        self.symbol_table = symbol_table
        self.tokens = lexer.tokenize()
        self.pos = 0
        self.current_token = self.tokens[0] if self.tokens else None
    
    def parse(self):
        try:
            tree = self.expr()
            if self.pos < len(self.tokens):
                return tree, False, f"Unexpected token: {self.current_token.value}"
            return tree, True, None
        except Exception as e:
            return None, False, str(e)
    
    def advance(self):
        self.pos += 1
        if self.pos < len(self.tokens):
            self.current_token = self.tokens[self.pos]
            # Add token to symbol table if it's an identifier
            if self.current_token.type == 'ID':
                self.symbol_table.add_symbol(self.current_token)
        else:
            self.current_token = None
    
    def expr(self):
        node = Node('E')
        t_node = self.term()
        node.children.append(t_node)
        
        e_prime_node = self.expr_prime()
        node.children.append(e_prime_node)
        
        return node
    
    def expr_prime(self):
        node = Node("E'")
        
        if self.current_token and self.current_token.type == 'PLUS':
            plus_node = Node('PLUS', self.current_token.value)
            node.children.append(plus_node)
            self.advance()
            
            t_node = self.term()
            node.children.append(t_node)
            
            e_prime_node = self.expr_prime()
            node.children.append(e_prime_node)
        else:
            # Empty production (epsilon)
            node.children.append(Node('Ɛ'))
        
        return node
    
    def term(self):
        node = Node('T')
        f_node = self.factor()
        node.children.append(f_node)
        
        t_prime_node = self.term_prime()
        node.children.append(t_prime_node)
        
        return node
    
    def term_prime(self):
        node = Node("T'")
        
        if self.current_token and self.current_token.type == 'MULT':
            mult_node = Node('MULT', self.current_token.value)
            node.children.append(mult_node)
            self.advance()
            
            f_node = self.factor()
            node.children.append(f_node)
            
            t_prime_node = self.term_prime()
            node.children.append(t_prime_node)
        else:
            # Empty production (epsilon)
            node.children.append(Node('Ɛ'))
        
        return node
    
    def factor(self):
        node = Node('F')
        
        if self.current_token.type == 'LPAREN':
            lparen_node = Node('LPAREN', self.current_token.value)
            node.children.append(lparen_node)
            self.advance()
            
            e_node = self.expr()
            node.children.append(e_node)
            
            if not self.current_token or self.current_token.type != 'RPAREN':
                raise Exception("Expected closing parenthesis")
            
            rparen_node = Node('RPAREN', self.current_token.value)
            node.children.append(rparen_node)
            self.advance()
        elif self.current_token.type == 'ID':
            id_node = Node('ID', self.current_token.value)
            node.children.append(id_node)
            self.advance()
        else:
            raise Exception(f"Unexpected token: {self.current_token.type}")
        
        return node

def analyze_expression(text):
    try:
        # Tokenize the input
        lexer = Lexer(text)
        tokens = lexer.tokenize()
        
        # Re-initialize for parsing
        lexer = Lexer(text)
        symbol_table = SymbolTable()
        parser = Parser(lexer, symbol_table)
        
        # Add tokens to symbol table
        for token in tokens:
            if token.type == 'ID':
                symbol_table.add_symbol(token)
        
        # Parse the input
        parse_tree, is_accepted, error = parser.parse()
        
        # Prepare the result
        result = {
            'input': text,
            'tokens': [token.to_dict() for token in tokens],
            'is_accepted': is_accepted,
            'symbol_table': symbol_table.get_table(),
            'error': error
        }
        
        if parse_tree:
            result['parse_tree'] = parse_tree.to_dict()
        
        return result
    except Exception as e:
        return {
            'input': text,
            'is_accepted': False,
            'error': str(e)
        }

# Flask app for Vercel serverless function
app = Flask(__name__)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    expression = data.get('expression', '')
    
    if not expression:
        return jsonify({'error': 'No expression provided'}), 400
    
    result = analyze_expression(expression)
    return jsonify(result)

@app.route('/api/analyze-file', methods=['POST'])
def analyze_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        content = file.read().decode('utf-8')
        expressions = [line.strip() for line in content.split('\n') if line.strip()]
        
        results = []
        for expression in expressions:
            result = analyze_expression(expression)
            results.append(result)
        
        return jsonify({'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/examples', methods=['GET'])
def get_examples():
    examples = [
        "3+4*5",
        "a+b*c",
        "x*(y+z)",
        "(a+b)*c",
        "1+2+3+4",
        "1*2*3*4"
    ]
    return jsonify({'examples': examples})

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Lexical Analyzer API is running"})

# For local testing
if __name__ == '__main__':
    app.run(debug=True)

# For Vercel Serverless Function
def handler(request, context):
    with app.request_context(request.environ):
        return app(request.environ)