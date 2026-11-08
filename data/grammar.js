/*
 * Add new grammar topics here. No HTML/CSS/app.js edits needed.
 *
 * 1) Create assets/<topic-id>/ and upload images.
 * 2) Add one topic object to GRAMMAR_CATALOG below.
 * 3) Add one set object for each A/B image pair.
 *
 * imagePattern supports {id} and {role}. 
 *   "set{id}_student{role}.png" -> set01_studentA.png (old infinitives)
 *   "set{id}_{role}.png"        -> set01_a.png when roleCase is "lower"
 *
 * Each set can optionally override filenames with:
 *   images: { A: "custom-a.png", B: "custom-b.png" }
 * (filenames are relative to the folder above; paths can also be used).
 * The game does NOT display or require the number of differences.
 */
window.GRAMMAR_CATALOG = [
  {
    id: "infinitives",
    title: "Infinitives (to + verb)",
    folder: "assets/infinitives",
    imagePattern: "set{id}_student{role}.png",
    roleCase: "upper",
    sets: [
      { id: "01", title: "After School", level: "Easy" },
      { id: "02", title: "At the Library", level: "Easy" },
      { id: "03", title: "Cooking Dinner", level: "Middle" },
      { id: "04", title: "At the Train Station", level: "Middle" },
      { id: "05", title: "School Festival Preparation", level: "Hard" },
      { id: "06", title: "At the Airport", level: "Hard" }
    ]
  },
  {
    id: "participles",
    title: "Participle (Ving/Vpp)",
    folder: "assets/participles",
    imagePattern: "set{id}_{role}.png",
    roleCase: "lower",
    sets: [
      { id: "01", title: "In the Classroom", level: "Easy" },
      { id: "02", title: "Cooking", level: "Easy" },
      { id: "03", title: "In the Park", level: "Middle" },
      { id: "04", title: "School Festival Preparation", level: "Middle" },
      { id: "05", title: "At the Airport", level: "Hard" }
    ]
  }

  /* Example of a future topic (remove the surrounding comment and add a comma after the topic above):
  ,{
    id: "relative-clauses",
    title: "Relative Clauses",
    folder: "assets/relative-clauses",
    imagePattern: "set{id}_{role}.png",
    roleCase: "lower",
    sets: [
      { id: "01", title: "At the Museum", level: "Easy" }
    ]
  }
  */
];
