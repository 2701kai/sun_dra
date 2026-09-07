/**
 * Every word on the page lives here. Edit freely.
 * No lyrics anywhere, only titles, on purpose.
 */

export const content = {
  name: "Sandra",
  site: "sun_dra",
  signature: "Kai",

  hero: {
    kicker: "a celebration of beautiful women",
    kickerTail: "and one in particular",
    arc: "✿ happy birthday ✿",
    tagline: "free spirit, self-made paradise, best version yet",
    scroll: "scroll, wildly",
    hint: "the flowers are draggable, the bee follows you, clicking anywhere makes more flowers. everything else just moves.",
  },

  marquee: [
    "peace",
    "love",
    "freedom",
    "sunshine",
    "Aotearoa",
    "clear water",
    "orange trees",
    "Steely San",
    "sovereignty",
    "Sandra",
  ],
  marqueeTwo: ["happy", "birthday", "you", "glorious", "human", "☮", "✿", "☼"],

  distance: {
    number: 20000,
    unit: "kilometres",
    title: "Some people travel to get away.",
    body:
      "Sandra travelled twenty thousand kilometres to arrive. Not somewhere. At herself. It turns out the longest road on earth leads to the one place nobody else can take you.",
    aside: "from where she started, to where she was always going",
  },

  journey: {
    label: "the long way round",
    title: "From Borkum to paradise.",
    intro:
      "Her own age of Aquarius, dawning. Another Kerouac novel's worth of road, an eternity of space and time to sail and travel, and an island at either end.",
    bee: "lekker hommeltje",
    stops: [
      {
        name: "Borkum",
        sub: "North Sea · where it started",
        text: "A small island with a lot of wind, and a girl with more horizon in her than there was island under her.",
      },
      {
        name: "Amsterdam",
        sub: "on the way",
        text: "A stop that could have become a life. They called her lekker hommeltje there. But the little bumblebee had to fly on.",
      },
      {
        name: "Everywhere between",
        sub: "sailed and travelled",
        text: "Roads, oceans, years. The kind of distance you don't measure in kilometres but in versions of yourself.",
      },
      {
        name: "Aotearoa",
        sub: "paradise · self-built",
        text: "Twenty thousand kilometres later: orange trees, a river, a deck, a butterfly in the window. Home.",
      },
    ],
  },

  paradise: {
    label: "paradise, self-built",
    title: "She didn't find paradise. She built it.",
    body:
      "Orange trees. A hammock strung between two afternoons. A butterfly in the window that throws colour across the room when the sun comes round. A wooden deck that catches the last of the light. Twenty thousand kilometres from where she started, and exactly where she belongs.",
    caption: "a walk through her own utopia",
    soundOn: "sound on",
    soundOff: "sound off",
  },

  river: {
    label: "the backdrop",
    title: "Nature that knows how to frame her.",
    body:
      "Water so clear it forgets to hide anything. Stones like a spilled bag of marbles. Green that goes turquoise where the river gets deep and thinks about it. Some countries look like they were designed as a backdrop for one particular person. This one was.",
    captions: ["a pool the colour of a good idea", "the river, seen from above, keeping its secrets badly"],
  },

  sovereign: {
    label: "sovereign",
    lines: [
      "She says what she wants.",
      "She says what she doesn't.",
      "And that happy, inspired freedom",
      "looks better on her",
      "than anything she has ever worn.",
    ],
    coda: "Never more beautiful than today. Never more herself.",
  },

  best: {
    label: "the best one",
    title: "Of all the Sandras that ever existed in this universe, this is the best one.",
    subtitle: "Including all the earlier Sandras. Especially those.",
    body:
      "Coincidentally, she's also the most attractive. This was checked, thoroughly, against every previous edition of her. They were all wonderful. This one still wins, and it isn't close.",
    stamp: "best version",
    stampSmall: "incl. all earlier versions",
    captions: ["evidence, exhibit A", "evidence, exhibit B", "the smiley agrees"],
  },

  steelySan: {
    label: "Steely San",
    title: "Not a tribute act. The original.",
    body:
      "Steel where it counts, soft everywhere else. Ten tracks of what she has built, walked away from, or walked twenty thousand kilometres towards. Remastered, obviously. She has never sounded better.",
    artist: "Steely San",
    album: "Sovereign (Deluxe Pressing)",
    sideA: "Side A · strengths",
    sideB: "Side B · achievements",
    tracks: [
      { n: "01", title: "Says What She Wants", note: "opening track, no fade-in" },
      { n: "02", title: "Says What She Doesn't", note: "the necessary B-side to 01" },
      { n: "03", title: "Steel, Softly", note: "spine of iron, voice of honey" },
      { n: "04", title: "Laughs Like She Means It", note: "see: every photo on this page" },
      { n: "05", title: "Her Own Weather", note: "unbothered, mostly sunny" },
      { n: "06", title: "Twenty Thousand Kilometres", note: "the long version" },
      { n: "07", title: "Built It Herself", note: "deck, garden, orange trees, life" },
      { n: "08", title: "A Butterfly in the Window", note: "colour, on purpose" },
      { n: "09", title: "Arrived at Herself", note: "the hit single" },
      { n: "10", title: "Home (Reprise)", note: "Aotearoa, forever" },
    ],
    liner: "All tracks written, performed and produced by Sandra. Mastered in Aotearoa. Audio from her own paradise walk, first pressing.",
    play: "drop the needle",
    pause: "lift the needle",
    nowPlaying: "now playing",
    other: "the other Steely, for reference",
    otherHref: "https://open.spotify.com/search/steely%20dan",
  },

  finale: {
    small: "to the woman who went the whole way round the world to come home to herself",
    big: "Happy Birthday",
    with: "with love, from the other side of the planet",
    confetti: "✿ more confetti ✿",
    footer: "sun_dra · made with sun, grain and a great deal of admiration",
  },
} as const;
