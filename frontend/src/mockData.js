// Mock data for development without backend
export const mockAnalysis = {
  input: "3+4*5",
  tokens: [
    { type: "ID", value: "3", position: [1, 1] },
    { type: "PLUS", value: "+", position: [1, 2] },
    { type: "ID", value: "4", position: [1, 3] },
    { type: "MULT", value: "*", position: [1, 4] },
    { type: "ID", value: "5", position: [1, 5] },
  ],
  is_accepted: true,
  symbol_table: {
    3: {
      type: "ID",
      value: "3",
      first_position: [1, 1],
      occurrences: 1,
      scope: "global",
    },
    4: {
      type: "ID",
      value: "4",
      first_position: [1, 3],
      occurrences: 1,
      scope: "global",
    },
    5: {
      type: "ID",
      value: "5",
      first_position: [1, 5],
      occurrences: 1,
      scope: "global",
    },
  },
  parse_tree: {
    name: "E",
    value: null,
    children: [
      {
        name: "T",
        value: null,
        children: [
          {
            name: "F",
            value: null,
            children: [{ name: "ID", value: "3", children: [] }],
          },
          {
            name: "T'",
            value: null,
            children: [{ name: "Ɛ", value: null, children: [] }],
          },
        ],
      },
      {
        name: "E'",
        value: null,
        children: [
          { name: "PLUS", value: "+", children: [] },
          {
            name: "T",
            value: null,
            children: [
              {
                name: "F",
                value: null,
                children: [{ name: "ID", value: "4", children: [] }],
              },
              {
                name: "T'",
                value: null,
                children: [
                  { name: "MULT", value: "*", children: [] },
                  {
                    name: "F",
                    value: null,
                    children: [{ name: "ID", value: "5", children: [] }],
                  },
                  {
                    name: "T'",
                    value: null,
                    children: [{ name: "Ɛ", value: null, children: [] }],
                  },
                ],
              },
            ],
          },
          {
            name: "E'",
            value: null,
            children: [{ name: "Ɛ", value: null, children: [] }],
          },
        ],
      },
    ],
  },
  error: null,
};

export const mockExamples = [
  "3+4*5",
  "a+b*c",
  "x*(y+z)",
  "(a+b)*c",
  "1+2+3+4",
  "1*2*3*4",
];
