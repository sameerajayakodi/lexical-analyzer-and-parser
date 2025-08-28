# Lexical Analyzer and Parser

A web application that simulates a lexical analyzer and parser for a specific grammar. This project provides a user-friendly interface to analyze expressions and visualize the parsing process.

## Features

- **Expression Analysis**: Analyze expressions according to the grammar rules
- **Lexical Analysis**: Tokenize expressions and display the tokens
- **Parsing**: Generate and visualize parse trees
- **Symbol Table**: Track and display symbols found during parsing
- **File Upload**: Process multiple expressions from a text file
- **History**: Keep track of previously analyzed expressions
- **Export Results**: Export analysis results to JSON files

## Grammar

The application implements a parser for the following grammar:

```
E → TE´
E´→ +TE´|Ɛ
T → FT´
T´→ *FT´|Ɛ
F → (E)|id
id → 0|1|2|3|4|5|6|7|8|9|a…z|A…Z
```

## Project Structure

- **Backend**: Python Flask API for lexical analysis and parsing
- **Frontend**: React application with Material-UI components

## Setup and Installation

### Backend

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Run the server:
   ```
   python app.py
   ```

### Frontend

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Open your browser to `http://localhost:3000`

## Usage

1. Enter an expression in the input field (e.g., `3+4*5`, `a+b*c`, `(x+y)*z`)
2. Click "Analyze" to process the expression
3. View the results in the different tabs:
   - Tokens: Shows all tokens identified in the expression
   - Symbol Table: Displays the symbol table with identifiers
   - Parse Tree: Visualizes the parse tree

## File Upload Format

You can upload a text file with multiple expressions to analyze. The file should contain one expression per line.

Example:

```
3+4*5
a+b*c
(x+y)*z
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
