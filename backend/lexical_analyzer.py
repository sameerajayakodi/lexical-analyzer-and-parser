# Lexical Analyzer and Parser Implementation
# This program simulates a lexical analyzer and a parser for the given grammar

class Token:
    def __init__(self, type, value, position):
        self.type = type
        self.value = value
        self.position = position
    
    def __repr__(self):
        return f"Token(type={self.type}, value='{self.value}', position={self.position})"
    
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
        self.current_char = self.text[self.pos] if len(self.text) > 0 else None
        self.line = 1
        self.column = 1
        self.tokens = []
    
    def error(self):
        raise Exception(f"Invalid character '{self.current_char}' at position {self.pos} (line {self.line}, column {self.column})")
    
    def advance(self):
        if self.current_char == '\n':
            self.line += 1
            self.column = 0
        
        self.pos += 1
        self.column += 1
        
        if self.pos >= len(self.text):
            self.current_char = None
        else:
            self.current_char = self.text[self.pos]
    
    def skip_whitespace(self):
        while self.current_char is not None and self.current_char.isspace():
            self.advance()
    
    def id(self):
        # Process an identifier (digit or letter)
        position = (self.line, self.column)
        result = ''
        
        while self.current_char is not None and (self.current_char.isalnum()):
            result += self.current_char
            self.advance()
            
        return Token('ID', result, position)
    
    def get_next_token(self):
        while self.current_char is not None:
            if self.current_char.isspace():
                self.skip_whitespace()
                continue
            
            if self.current_char.isalnum():
                return self.id()
            
            if self.current_char == '+':
                token = Token('PLUS', '+', (self.line, self.column))
                self.advance()
                return token
            
            if self.current_char == '*':
                token = Token('MULT', '*', (self.line, self.column))
                self.advance()
                return token
            
            if self.current_char == '(':
                token = Token('LPAREN', '(', (self.line, self.column))
                self.advance()
                return token
            
            if self.current_char == ')':
                token = Token('RPAREN', ')', (self.line, self.column))
                self.advance()
                return token
            
            self.error()
        
        return Token('EOF', None, (self.line, self.column))
    
    def tokenize(self):
        """Process the entire input and return all tokens"""
        self.tokens = []
        token = self.get_next_token()
        
        while token.type != 'EOF':
            self.tokens.append(token)
            token = self.get_next_token()
        
        return self.tokens


class SymbolTable:
    def __init__(self):
        self.symbols = {}
        self.scope = 'global'
    
    def add_symbol(self, token):
        """Add a token to the symbol table."""
        if token.type != 'ID':
            return  # Only store identifiers
        
        key = token.value
        if key not in self.symbols:
            self.symbols[key] = {
                'type': token.type,
                'value': token.value,
                'first_position': token.position,
                'occurrences': 1,
                'scope': self.scope
            }
        else:
            self.symbols[key]['occurrences'] += 1
    
    def get_table(self):
        """Return the symbol table as a dictionary."""
        return self.symbols


class Node:
    def __init__(self, name, value=None, children=None):
        self.name = name
        self.value = value
        self.children = children or []
    
    def add_child(self, node):
        self.children.append(node)
    
    def to_dict(self):
        """Convert node to dictionary for JSON serialization"""
        return {
            'name': self.name,
            'value': self.value,
            'children': [child.to_dict() for child in self.children]
        }


class Parser:
    def __init__(self, lexer, symbol_table):
        self.lexer = lexer
        self.symbol_table = symbol_table
        self.current_token = self.lexer.get_next_token()
        self.errors = []
    
    def error(self, expected_type=None):
        error_msg = f"Syntax Error at position {self.current_token.position}"
        if expected_type:
            error_msg = f"Syntax Error: Expected {expected_type}, got {self.current_token.type} at position {self.current_token.position}"
        
        self.errors.append(error_msg)
        raise Exception(error_msg)
    
    def eat(self, token_type):
        # Compare the current token type with the passed token type
        # and if they match, eat the current token and assign the next token
        if self.current_token.type == token_type:
            token = self.current_token
            self.symbol_table.add_symbol(token)
            self.current_token = self.lexer.get_next_token()
            return token
        else:
            self.error(token_type)
    
    def parse(self):
        """Parse the input and return the root node of the parse tree."""
        try:
            root = self.expr()
            
            if self.current_token.type != 'EOF':
                self.error()
                
            return root, True, None
        except Exception as e:
            return None, False, str(e)
    
    def expr(self):
        """E → TE´"""
        node = Node('E')
        
        # Parse T
        t_node = self.term()
        node.add_child(t_node)
        
        # Parse E'
        e_prime_node = self.expr_prime()
        node.add_child(e_prime_node)
        
        return node
    
    def expr_prime(self):
        """E´→ +TE´|Ɛ"""
        node = Node("E'")
        
        if self.current_token.type == 'PLUS':
            # Parse +TE'
            plus_token = self.eat('PLUS')
            plus_node = Node('PLUS', plus_token.value)
            node.add_child(plus_node)
            
            t_node = self.term()
            node.add_child(t_node)
            
            e_prime_node = self.expr_prime()
            node.add_child(e_prime_node)
        else:
            # Parse Ɛ (epsilon)
            node.add_child(Node('Ɛ'))
        
        return node
    
    def term(self):
        """T → FT´"""
        node = Node('T')
        
        # Parse F
        f_node = self.factor()
        node.add_child(f_node)
        
        # Parse T'
        t_prime_node = self.term_prime()
        node.add_child(t_prime_node)
        
        return node
    
    def term_prime(self):
        """T´→ *FT´|Ɛ"""
        node = Node("T'")
        
        if self.current_token.type == 'MULT':
            # Parse *FT'
            mult_token = self.eat('MULT')
            mult_node = Node('MULT', mult_token.value)
            node.add_child(mult_node)
            
            f_node = self.factor()
            node.add_child(f_node)
            
            t_prime_node = self.term_prime()
            node.add_child(t_prime_node)
        else:
            # Parse Ɛ (epsilon)
            node.add_child(Node('Ɛ'))
        
        return node
    
    def factor(self):
        """F → (E)|id"""
        node = Node('F')
        
        if self.current_token.type == 'LPAREN':
            # Parse (E)
            lparen_token = self.eat('LPAREN')
            lparen_node = Node('LPAREN', lparen_token.value)
            node.add_child(lparen_node)
            
            e_node = self.expr()
            node.add_child(e_node)
            
            rparen_token = self.eat('RPAREN')
            rparen_node = Node('RPAREN', rparen_token.value)
            node.add_child(rparen_node)
        elif self.current_token.type == 'ID':
            # Parse id
            id_token = self.eat('ID')
            id_node = Node('ID', id_token.value)
            node.add_child(id_node)
        else:
            self.error("'(' or identifier")
        
        return node


def analyze_expression(text):
    """Analyze an expression and return structured results"""
    try:
        # Initialize components
        lexer = Lexer(text)
        tokens = lexer.tokenize()
        
        # Re-initialize for parsing
        lexer = Lexer(text)
        symbol_table = SymbolTable()
        parser = Parser(lexer, symbol_table)
        
        # Parse the input
        parse_tree, is_accepted, error = parser.parse()
        
        # Prepare results
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


# Function to test the analyzer with examples
def test_analyzer():
    test_expressions = [
        "3+4*5",
        "a+b*c",
        "x*(y+z)",
        "(a+b)*c",
        "3++4",  # Error case
        "3+4)",  # Error case
        "a*b+c*d",
        "1+2+3+4",
        "1*2*3*4"
    ]
    
    results = []
    for expr in test_expressions:
        result = analyze_expression(expr)
        results.append(result)
    
    return results


if __name__ == "__main__":
    # Test the analyzer
    results = test_analyzer()
    
    # Print results
    for result in results:
        print(f"\nExpression: {result['input']}")
        print(f"Accepted: {result['is_accepted']}")
        if result['error']:
            print(f"Error: {result['error']}")