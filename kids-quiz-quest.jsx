import React, { useState } from "react";
import { Star, Coins, Trophy, Home, Volume2, VolumeX, RotateCcw, Check, X, ArrowRight, Gift, Lock } from "lucide-react";

/* ---------------------------------- HELPERS: randomness ---------------------------------- */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

// Shuffle an options array while keeping track of where the correct answer landed.
function shuffleOptionsKeepCorrect(options, correctIdx) {
  const correctVal = options[correctIdx];
  const tagged = shuffle(options.map((o, i) => ({ o, i })));
  const newOptions = tagged.map((x) => x.o);
  const newCorrect = newOptions.indexOf(correctVal);
  return { options: newOptions, correct: newCorrect };
}

function buildNumberOptions(correctVal) {
  const distractors = new Set();
  let guard = 0;
  while (distractors.size < 3 && guard < 40) {
    guard++;
    const delta = Math.floor(Math.random() * 5) + 1;
    const sign = Math.random() < 0.5 ? -1 : 1;
    let d = correctVal + sign * delta;
    if (d < 0) d = correctVal + delta;
    if (d !== correctVal) distractors.add(d);
  }
  const optionsRaw = shuffle([correctVal, ...distractors]).map(String);
  const correct = optionsRaw.indexOf(String(correctVal));
  return { options: optionsRaw, correct };
}

/* ---------------------------------- CONTENT POOLS ---------------------------------- */

const ANIMAL_POOL = [
  { emoji: "🦁", q: "Which animal is this?", options: ["Tiger", "Lion", "Bear", "Wolf"], correct: 1 },
  { emoji: "🐝", q: "What do bees make?", options: ["Milk", "Silk", "Honey", "Wax"], correct: 2 },
  { emoji: "🦒", q: "Which animal is this?", options: ["Elephant", "Giraffe", "Horse", "Camel"], correct: 1 },
  { emoji: "🐶", q: "What do you call a baby dog?", options: ["Kitten", "Cub", "Puppy", "Calf"], correct: 2 },
  { emoji: "🦇", q: "Which of these animals can fly?", options: ["Bat", "Elephant", "Fish", "Snake"], correct: 0 },
  { emoji: "🐟", q: "Where do fish live?", options: ["Trees", "Water", "Caves", "Sand"], correct: 1 },
  { emoji: "🐛", q: "What does a caterpillar turn into?", options: ["A bee", "A moth only", "A butterfly", "A beetle"], correct: 2 },
  { emoji: "🐘", q: "Which animal has a long trunk?", options: ["Elephant", "Zebra", "Deer", "Rhino"], correct: 0 },
  { emoji: "🐨", q: "Which animal is this?", options: ["Koala", "Panda", "Bear", "Sloth"], correct: 0 },
  { emoji: "🦓", q: "Which animal is this?", options: ["Horse", "Zebra", "Donkey", "Deer"], correct: 1 },
  { emoji: "🐧", q: "Which animal is this?", options: ["Penguin", "Duck", "Seal", "Puffin"], correct: 0 },
  { emoji: "🦉", q: "Which bird can turn its head almost all the way around?", options: ["Eagle", "Owl", "Parrot", "Crow"], correct: 1 },
  { emoji: "🐢", q: "Which animal is this?", options: ["Turtle", "Crab", "Snail", "Lizard"], correct: 0 },
  { emoji: "🐍", q: "Which animal has no legs?", options: ["Lizard", "Snake", "Worm", "Frog"], correct: 1 },
  { emoji: "🐄", q: "Which animal gives us milk?", options: ["Cow", "Horse", "Zebra", "Deer"], correct: 0 },
  { emoji: "🦋", q: "Which animal is this?", options: ["Moth", "Butterfly", "Bee", "Dragonfly"], correct: 1 },
];

const SPACE_POOL = [
  { emoji: "🌍", q: "Which planet do we live on?", options: ["Mars", "Earth", "Venus", "Jupiter"], correct: 1 },
  { emoji: "☀️", q: "What is the closest star to Earth?", options: ["The Moon", "Polaris", "The Sun", "Sirius"], correct: 2 },
  { emoji: "✨", q: "What do we call a group of stars that forms a picture?", options: ["Galaxy", "Constellation", "Nebula", "Comet"], correct: 1 },
  { emoji: "🔴", q: "Which planet is known as the Red Planet?", options: ["Mars", "Mercury", "Saturn", "Neptune"], correct: 0 },
  { emoji: "🌙", q: "What is the Moon?", options: ["A star", "A planet", "A rock that orbits Earth", "A cloud"], correct: 2 },
  { emoji: "👨‍🚀", q: "Who was the first person to walk on the Moon?", options: ["Neil Armstrong", "Yuri Gagarin", "Tim Peake", "Buzz Lightyear"], correct: 0 },
  { emoji: "🚀", q: "What do astronauts ride into space?", options: ["A plane", "A rocket", "A balloon", "A submarine"], correct: 1 },
  { emoji: "🪐", q: "How many planets are in our solar system?", options: ["7", "9", "8", "10"], correct: 2 },
  { emoji: "🛰️", q: "What orbits Earth and helps TVs and phones work?", options: ["A satellite", "A comet", "A meteor", "A star"], correct: 0 },
  { emoji: "☄️", q: "What is a bright ball of ice and dust flying through space?", options: ["An asteroid", "A comet", "A planet", "A moon"], correct: 1 },
  { emoji: "🌌", q: "What is the name of our home galaxy?", options: ["Andromeda", "Milky Way", "Whirlpool", "Sombrero"], correct: 1 },
  { emoji: "🧑‍🚀", q: "What do astronauts wear to breathe in space?", options: ["A helmet", "A spacesuit", "A mask", "A backpack"], correct: 1 },
];

const WORD_POOL = [
  { emoji: "😊", q: "Which word means the same as \"happy\"?", options: ["Angry", "Joyful", "Sad", "Tired"], correct: 1 },
  { emoji: "🐘", q: "Which word means the same as \"big\"?", options: ["Tiny", "Little", "Huge", "Short"], correct: 2 },
  { emoji: "🥵", q: "What is the opposite of \"hot\"?", options: ["Warm", "Cold", "Wet", "Sunny"], correct: 1 },
  { emoji: "🐆", q: "Which word means the same as \"fast\"?", options: ["Slow", "Lazy", "Quick", "Quiet"], correct: 2 },
  { emoji: "🌙", q: "What is the opposite of \"day\"?", options: ["Night", "Sun", "Morning", "Hour"], correct: 0 },
  { emoji: "🐜", q: "Which word means the same as \"small\"?", options: ["Tiny", "Giant", "Loud", "Wide"], correct: 0 },
  { emoji: "⬇️", q: "What is the opposite of \"up\"?", options: ["Left", "Down", "Over", "Near"], correct: 1 },
  { emoji: "🧠", q: "Which word means the same as \"smart\"?", options: ["Silly", "Clumsy", "Clever", "Slow"], correct: 2 },
  { emoji: "😢", q: "What is the opposite of \"happy\"?", options: ["Sad", "Glad", "Calm", "Proud"], correct: 0 },
  { emoji: "🐌", q: "What is the opposite of \"fast\"?", options: ["Quick", "Slow", "Loud", "Bright"], correct: 1 },
  { emoji: "💪", q: "Which word means the same as \"strong\"?", options: ["Weak", "Mighty", "Soft", "Tiny"], correct: 1 },
  { emoji: "🌟", q: "Which word means the same as \"shiny\"?", options: ["Dull", "Dark", "Sparkly", "Plain"], correct: 2 },
  { emoji: "🧹", q: "Which word means the same as \"clean\"?", options: ["Dirty", "Messy", "Tidy", "Rough"], correct: 2 },
  { emoji: "😨", q: "Which word means the same as \"scared\"?", options: ["Brave", "Afraid", "Happy", "Calm"], correct: 1 },
];

const FRUIT_POOL = [
  { name: "Apple", emoji: "🍎" }, { name: "Banana", emoji: "🍌" }, { name: "Grapes", emoji: "🍇" },
  { name: "Orange", emoji: "🍊" }, { name: "Strawberry", emoji: "🍓" }, { name: "Pineapple", emoji: "🍍" },
  { name: "Peach", emoji: "🍑" }, { name: "Watermelon", emoji: "🍉" }, { name: "Mango", emoji: "🥭" },
  { name: "Cherries", emoji: "🍒" }, { name: "Kiwi", emoji: "🥝" }, { name: "Lemon", emoji: "🍋" },
  { name: "Pear", emoji: "🍐" }, { name: "Coconut", emoji: "🥥" },
];

const VEGGIE_POOL = [
  { name: "Carrot", emoji: "🥕" }, { name: "Potato", emoji: "🥔" }, { name: "Tomato", emoji: "🍅" },
  { name: "Broccoli", emoji: "🥦" }, { name: "Corn", emoji: "🌽" }, { name: "Cucumber", emoji: "🥒" },
  { name: "Onion", emoji: "🧅" }, { name: "Bell Pepper", emoji: "🫑" }, { name: "Eggplant", emoji: "🍆" },
  { name: "Cabbage", emoji: "🥬" }, { name: "Garlic", emoji: "🧄" }, { name: "Chili Pepper", emoji: "🌶️" },
];

const IDENTIFY_POOL = [
  { name: "Ball", emoji: "⚽" }, { name: "Balloon", emoji: "🎈" }, { name: "Hat", emoji: "👒" },
  { name: "Shoe", emoji: "👟" }, { name: "Umbrella", emoji: "☂️" }, { name: "Key", emoji: "🔑" },
  { name: "Clock", emoji: "⏰" }, { name: "Book", emoji: "📖" }, { name: "Pencil", emoji: "✏️" },
  { name: "Chair", emoji: "🪑" }, { name: "Door", emoji: "🚪" }, { name: "Bed", emoji: "🛏️" },
  { name: "Car", emoji: "🚗" }, { name: "Airplane", emoji: "✈️" }, { name: "Bicycle", emoji: "🚲" },
  { name: "Phone", emoji: "📱" },
];

const ABC_POOL = [
  { letter: "A", name: "Apple", emoji: "🍎" }, { letter: "B", name: "Ball", emoji: "⚽" },
  { letter: "C", name: "Cat", emoji: "🐱" }, { letter: "D", name: "Dog", emoji: "🐶" },
  { letter: "E", name: "Elephant", emoji: "🐘" }, { letter: "F", name: "Fish", emoji: "🐟" },
  { letter: "G", name: "Grapes", emoji: "🍇" }, { letter: "H", name: "Hat", emoji: "🎩" },
  { letter: "I", name: "Ice Cream", emoji: "🍦" }, { letter: "J", name: "Juice", emoji: "🧃" },
  { letter: "K", name: "Kite", emoji: "🪁" }, { letter: "L", name: "Lion", emoji: "🦁" },
  { letter: "M", name: "Moon", emoji: "🌙" }, { letter: "N", name: "Nut", emoji: "🥜" },
  { letter: "O", name: "Orange", emoji: "🍊" }, { letter: "P", name: "Pizza", emoji: "🍕" },
  { letter: "Q", name: "Queen", emoji: "👸" }, { letter: "R", name: "Rainbow", emoji: "🌈" },
  { letter: "S", name: "Sun", emoji: "☀️" }, { letter: "T", name: "Tree", emoji: "🌳" },
  { letter: "U", name: "Umbrella", emoji: "☔" }, { letter: "V", name: "Violin", emoji: "🎻" },
  { letter: "W", name: "Wolf", emoji: "🐺" }, { letter: "X", name: "X-ray", emoji: "🩻" },
  { letter: "Y", name: "Yo-yo", emoji: "🪀" }, { letter: "Z", name: "Zebra", emoji: "🦓" },
];

const COLOR_POOL = [
  { name: "Red", hex: "#E74C3C" }, { name: "Blue", hex: "#3498DB" }, { name: "Yellow", hex: "#F4D03F" },
  { name: "Green", hex: "#2ECC71" }, { name: "Orange", hex: "#E67E22" }, { name: "Purple", hex: "#9B59B6" },
  { name: "Pink", hex: "#FF6FA5" }, { name: "Brown", hex: "#8B5E3C" }, { name: "Black", hex: "#2C3E50" },
  { name: "White", hex: "#FFFFFF" },
];

const SHAPE_POOL = [
  { name: "Circle", id: "circle", color: "#FF6F59" }, { name: "Square", id: "square", color: "#4CAF7D" },
  { name: "Triangle", id: "triangle", color: "#8B5FBF" }, { name: "Star", id: "star", color: "#F2A93B" },
  { name: "Rectangle", id: "rectangle", color: "#3E7CB1" }, { name: "Heart", id: "heart", color: "#FF6FA5" },
  { name: "Pentagon", id: "pentagon", color: "#E67E22" }, { name: "Oval", id: "oval", color: "#2ECC71" },
];

const COUNT_EMOJIS = ["🍎", "⭐", "🐱", "🎈", "🍓", "⚽", "🐶", "🌸"];

/* ---------------------------------- QUESTION GENERATORS ---------------------------------- */
/* Every subject rebuilds a fresh set of 8 questions each time it's played, so no two
   rounds look the same — pools are sampled and shuffled, math & counting are procedural. */

function genFromTriviaPool(pool, n = 8) {
  return sample(pool, n).map((item) => {
    const { options, correct } = shuffleOptionsKeepCorrect(item.options, item.correct);
    return { visual: { type: "emoji", value: item.emoji }, prompt: item.q, options, correct };
  });
}

function genFromNamePool(pool, promptText, n = 8) {
  return sample(pool, n).map((item) => {
    const distractors = sample(pool.filter((p) => p.name !== item.name), 3).map((d) => d.name);
    const optionsRaw = shuffle([item.name, ...distractors]);
    const correct = optionsRaw.indexOf(item.name);
    return { visual: { type: "emoji", value: item.emoji }, prompt: promptText, options: optionsRaw, correct };
  });
}

function genABC(n = 8) {
  return sample(ABC_POOL, n).map((item) => {
    const distractors = sample(ABC_POOL.filter((p) => p.letter !== item.letter), 3).map((d) => d.letter);
    const optionsRaw = shuffle([item.letter, ...distractors]);
    const correct = optionsRaw.indexOf(item.letter);
    return { visual: { type: "emoji", value: item.emoji }, prompt: "Which letter does this picture start with?", options: optionsRaw, correct };
  });
}

function genCounting(n = 8) {
  const arr = [];
  const usedKeys = new Set();
  let guard = 0;
  while (arr.length < n && guard < 300) {
    guard++;
    const emoji = COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];
    const count = 1 + Math.floor(Math.random() * 9);
    const key = emoji + count;
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);
    const { options, correct } = buildNumberOptions(count);
    arr.push({ visual: { type: "emojiGroup", value: emoji, count }, prompt: "How many are there? Count carefully!", options, correct });
  }
  return arr;
}

function genColorsShapes(n = 8) {
  const arr = [];
  const usedKeys = new Set();
  let guard = 0;
  while (arr.length < n && guard < 300) {
    guard++;
    const useColor = Math.random() < 0.5;
    if (useColor) {
      const chosen = COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];
      const key = "c" + chosen.name;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key);
      const distractors = sample(COLOR_POOL.filter((c) => c.name !== chosen.name), 3).map((c) => c.name);
      const optionsRaw = shuffle([chosen.name, ...distractors]);
      const correct = optionsRaw.indexOf(chosen.name);
      arr.push({ visual: { type: "color", value: chosen.hex }, prompt: "What color is this?", options: optionsRaw, correct });
    } else {
      const chosen = SHAPE_POOL[Math.floor(Math.random() * SHAPE_POOL.length)];
      const key = "s" + chosen.name;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key);
      const distractors = sample(SHAPE_POOL.filter((s) => s.name !== chosen.name), 3).map((s) => s.name);
      const optionsRaw = shuffle([chosen.name, ...distractors]);
      const correct = optionsRaw.indexOf(chosen.name);
      arr.push({ visual: { type: "shape", value: chosen.id, color: chosen.color }, prompt: "What shape is this?", options: optionsRaw, correct });
    }
  }
  return arr;
}

function genMath(n = 8) {
  const arr = [];
  const used = new Set();
  let guard = 0;
  const pickEmoji = () => COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];

  while (arr.length < n && guard < 400) {
    guard++;
    const type = Math.floor(Math.random() * 5);
    let item = null;

    if (type === 0) {
      const a = 1 + Math.floor(Math.random() * 9);
      const b = 1 + Math.floor(Math.random() * 9);
      const { options, correct } = buildNumberOptions(a + b);
      const visual = a <= 6 && b <= 6 ? { type: "mathPic", emoji: pickEmoji(), a, b, op: "+" } : { type: "equation", text: `${a} + ${b}` };
      item = { visual, prompt: "What does this add up to?", options, correct, key: `add${a}${b}` };
    } else if (type === 1) {
      const a = 2 + Math.floor(Math.random() * 15);
      const b = 1 + Math.floor(Math.random() * a);
      const { options, correct } = buildNumberOptions(a - b);
      const visual = a <= 8 ? { type: "mathPic", emoji: pickEmoji(), a, b, op: "−" } : { type: "equation", text: `${a} − ${b}` };
      item = { visual, prompt: "What is left after taking away?", options, correct, key: `sub${a}${b}` };
    } else if (type === 2) {
      const a = 1 + Math.floor(Math.random() * 9);
      const b = 1 + Math.floor(Math.random() * 9);
      const { options, correct } = buildNumberOptions(a * b);
      item = { visual: { type: "equation", text: `${a} × ${b}` }, prompt: "What is the answer?", options, correct, key: `mul${a}${b}` };
    } else if (type === 3) {
      const b = 2 + Math.floor(Math.random() * 5);
      const q = 1 + Math.floor(Math.random() * 8);
      const a = b * q;
      const { options, correct } = buildNumberOptions(q);
      item = { visual: { type: "equation", text: `${a} ÷ ${b}` }, prompt: "What is the answer?", options, correct, key: `div${a}${b}` };
    } else {
      if (Math.random() < 0.5) {
        const num = 2 + Math.floor(Math.random() * 19);
        const optsArr = shuffle(["Even", "Odd"]);
        const correctLabel = num % 2 === 0 ? "Even" : "Odd";
        item = { visual: { type: "equation", text: `${num}` }, prompt: "Is this number even or odd?", options: optsArr, correct: optsArr.indexOf(correctLabel), key: `eo${num}` };
      } else {
        const even = 2 * (1 + Math.floor(Math.random() * 10));
        const { options, correct } = buildNumberOptions(even / 2);
        item = { visual: { type: "equation", text: `${even}` }, prompt: "What is half of this number?", options, correct, key: `half${even}` };
      }
    }

    if (item && !used.has(item.key)) {
      used.add(item.key);
      arr.push(item);
    }
  }
  return arr;
}

/* ---------------------------------- SUBJECTS ---------------------------------- */

const SUBJECTS = [
  { id: "math", name: "Math Blast", tagline: "Numbers, sums & speedy shapes", emoji: "🚀", color: "#FF6F59", dark: "#E0503D", generate: () => genMath(8) },
  { id: "animals", name: "Animal Kingdom", tagline: "Wild facts about creatures", emoji: "🦁", color: "#4CAF7D", dark: "#37945F", generate: () => genFromTriviaPool(ANIMAL_POOL, 8) },
  { id: "space", name: "Space Explorers", tagline: "Planets, stars & rockets", emoji: "🪐", color: "#8B5FBF", dark: "#6E45A0", generate: () => genFromTriviaPool(SPACE_POOL, 8) },
  { id: "words", name: "Word Wizards", tagline: "Fun with words & meanings", emoji: "📖", color: "#3E7CB1", dark: "#2E5F8A", generate: () => genFromTriviaPool(WORD_POOL, 8) },
  { id: "fruits", name: "Fruity Fun", tagline: "Spot your favorite fruits", emoji: "🍓", color: "#F2618B", dark: "#D6446E", generate: () => genFromNamePool(FRUIT_POOL, "What fruit is this?", 8) },
  { id: "veggies", name: "Veggie Patch", tagline: "Meet garden vegetables", emoji: "🥕", color: "#2FAF8F", dark: "#1F8A70", generate: () => genFromNamePool(VEGGIE_POOL, "What vegetable is this?", 8) },
  { id: "abc", name: "ABC Adventure", tagline: "Letters & first sounds", emoji: "🔤", color: "#D98C1F", dark: "#B36F14", generate: () => genABC(8) },
  { id: "numbers", name: "Number Ninjas", tagline: "Count it up!", emoji: "🔢", color: "#5B6FD9", dark: "#3F52B8", generate: () => genCounting(8) },
  { id: "colorsshapes", name: "Colors & Shapes", tagline: "Spot colors and shapes", emoji: "🌈", color: "#C2478A", dark: "#9E3570", generate: () => genColorsShapes(8) },
  { id: "identify", name: "Identify It!", tagline: "Name everyday things", emoji: "🔍", color: "#E67E22", dark: "#C2660F", generate: () => genFromNamePool(IDENTIFY_POOL, "What is this called?", 8) },
];

const MAX_ATTEMPTS = 3; // first try + 2 more chances
const BASE_AVATARS = ["🦊", "🐼", "🐸", "🦄"];
const SHOP_AVATARS = [
  { emoji: "🐶", cost: 40 }, { emoji: "🐰", cost: 70 }, { emoji: "🐨", cost: 100 }, { emoji: "🦉", cost: 140 },
];

/* ---------------------------------- SOUND ---------------------------------- */

function playTone(kind) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    if (kind === "correct") {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.3);
      });
    } else if (kind === "wrong") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (kind === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (kind === "coin") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
    setTimeout(() => ctx.close(), 800);
  } catch (e) {
    /* audio not available — fail silently */
  }
}

function badgeForScore(correct, total) {
  const pct = correct / total;
  if (pct === 1) return { label: "Gold Champion", emoji: "🥇", color: "#F2A93B" };
  if (pct >= 0.75) return { label: "Silver Star", emoji: "🥈", color: "#B8C0CC" };
  if (pct >= 0.5) return { label: "Bronze Buddy", emoji: "🥉", color: "#C97C4B" };
  return { label: "Keep Practicing", emoji: "🌱", color: "#4CAF7D" };
}

function coinsForAttempt(attemptIndex, streak) {
  const base = [15, 8, 4][attemptIndex] ?? 4;
  return base + streak * 2;
}

/* ---------------------------------- APP ---------------------------------- */

export default function KidsQuizQuest() {
  const [screen, setScreen] = useState("home"); // home | quiz | result | shop
  const [avatar, setAvatar] = useState("🦊");
  const [unlockedAvatars, setUnlockedAvatars] = useState(BASE_AVATARS);
  const [subjectId, setSubjectId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [triedWrong, setTriedWrong] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [runCoins, setRunCoins] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | 'revealed' | null
  const [soundOn, setSoundOn] = useState(true);
  const [confettiKey, setConfettiKey] = useState(0);
  const [bestBySubject, setBestBySubject] = useState({});

  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const question = questions[qIndex];
  const total = questions.length;

  function sound(kind) {
    if (soundOn) playTone(kind);
  }

  function startQuiz(id) {
    sound("click");
    const subj = SUBJECTS.find((s) => s.id === id);
    setQuestions(subj.generate());
    setSubjectId(id);
    setQIndex(0);
    setTriedWrong([]);
    setStreak(0);
    setCorrectCount(0);
    setRunCoins(0);
    setSolved(false);
    setFeedback(null);
    setScreen("quiz");
  }

  function handleSelect(optionIndex) {
    if (solved || triedWrong.includes(optionIndex)) return;
    const isCorrect = optionIndex === question.correct;

    if (isCorrect) {
      sound("correct");
      const earned = coinsForAttempt(triedWrong.length, streak);
      setFeedback("correct");
      setSolved(true);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
      setCorrectCount((c) => c + 1);
      setRunCoins((p) => p + earned);
      setCoinBalance((p) => p + earned);
      setConfettiKey((k) => k + 1);
    } else {
      const nextTried = [...triedWrong, optionIndex];
      setTriedWrong(nextTried);
      setStreak(0);
      if (nextTried.length >= MAX_ATTEMPTS) {
        sound("wrong");
        setFeedback("revealed");
        setSolved(true);
      } else {
        sound("wrong");
        setFeedback("wrong");
      }
    }
  }

  function goNext() {
    sound("click");
    const isLast = qIndex >= total - 1;
    if (isLast) {
      finishQuiz();
      return;
    }
    setQIndex((i) => i + 1);
    setTriedWrong([]);
    setSolved(false);
    setFeedback(null);
  }

  function finishQuiz() {
    setBestBySubject((prev) => ({
      ...prev,
      [subjectId]: Math.max(prev[subjectId] || 0, correctCount),
    }));
    setScreen("result");
  }

  function goHome() {
    sound("click");
    setScreen("home");
    setSubjectId(null);
  }

  function unlockAvatar(item) {
    if (coinBalance < item.cost || unlockedAvatars.includes(item.emoji)) return;
    sound("coin");
    setCoinBalance((c) => c - item.cost);
    setUnlockedAvatars((u) => [...u, item.emoji]);
    setAvatar(item.emoji);
  }

  const totalStarsEarned = Object.values(bestBySubject).reduce((a, b) => a + b, 0);
  const maxStars = SUBJECTS.length * 8;

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@500;700;800&display=swap');

        .qq-display { font-family: 'Baloo 2', 'Nunito', sans-serif; }
        .qq-body { font-family: 'Nunito', sans-serif; }

        @keyframes qq-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes qq-drift {
          from { transform: translateX(-10%); }
          to { transform: translateX(110%); }
        }
        @keyframes qq-pop-in {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes qq-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-14px) scale(1.05); }
          50% { transform: translateY(0) scale(0.98); }
        }
        @keyframes qq-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px) rotate(-2deg); }
          40% { transform: translateX(8px) rotate(2deg); }
          60% { transform: translateX(-6px) rotate(-1deg); }
          80% { transform: translateX(6px) rotate(1deg); }
        }
        @keyframes qq-confetti {
          0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
        }
        @keyframes qq-glow-in {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes qq-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        .qq-cloud { animation: qq-drift linear infinite; opacity: 0.9; }
        .qq-mascot-idle { animation: qq-float 3s ease-in-out infinite; }
        .qq-pop { animation: qq-pop-in 0.35s ease-out; }
        .qq-bounce { animation: qq-bounce 0.55s ease; }
        .qq-shake { animation: qq-shake 0.45s ease; }
        .qq-glow-in { animation: qq-glow-in 0.5s cubic-bezier(.34,1.56,.64,1); }
        .qq-visual-pop { animation: qq-glow-in 0.4s cubic-bezier(.34,1.56,.64,1); }
        .qq-pulse { animation: qq-pulse 2.2s ease-in-out infinite; }

        .qq-btn { transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease; }
        .qq-btn:active { transform: translateY(2px) scale(0.98); }
        .qq-btn:not(:disabled):hover { filter: brightness(1.05); }

        .qq-tile:hover .qq-tile-inner { transform: translateY(-4px); }
        .qq-tile-inner { transition: transform 0.15s ease; }
      `}</style>

      {/* Ambient sky decorations */}
      <div style={styles.skyDecor} aria-hidden="true">
        <div style={{ ...styles.sun }} />
        <div className="qq-cloud" style={{ ...styles.cloud, top: "8%", width: 90, animationDuration: "38s" }} />
        <div className="qq-cloud" style={{ ...styles.cloud, top: "18%", width: 60, animationDuration: "52s", animationDelay: "-10s" }} />
        <div className="qq-cloud" style={{ ...styles.cloud, top: "4%", width: 70, animationDuration: "46s", animationDelay: "-25s" }} />
      </div>

      <div style={styles.container}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <button
            className="qq-btn"
            onClick={screen === "home" ? undefined : goHome}
            style={{ ...styles.pillButton, cursor: screen === "home" ? "default" : "pointer", opacity: screen === "home" ? 0.55 : 1 }}
            aria-label="Home"
          >
            <Home size={18} color="#1F2D50" />
            <span className="qq-body" style={styles.pillText}>Home</span>
          </button>

          <button
            className="qq-btn"
            onClick={() => { if (screen !== "quiz") { sound("click"); setScreen("shop"); } }}
            style={{ ...styles.pointsPill, cursor: screen === "quiz" ? "default" : "pointer" }}
            aria-label="Coin balance — open reward shop"
          >
            <Coins size={18} color="#F2A93B" />
            <span className="qq-display" style={styles.pointsText}>{coinBalance}</span>
          </button>

          <button
            className="qq-btn"
            onClick={() => setSoundOn((s) => !s)}
            style={styles.pillButton}
            aria-label={soundOn ? "Mute sound" : "Unmute sound"}
          >
            {soundOn ? <Volume2 size={18} color="#1F2D50" /> : <VolumeX size={18} color="#1F2D50" />}
          </button>
        </div>

        {screen === "home" && (
          <HomeScreen
            avatar={avatar}
            unlockedAvatars={unlockedAvatars}
            setAvatar={setAvatar}
            bestBySubject={bestBySubject}
            totalStarsEarned={totalStarsEarned}
            maxStars={maxStars}
            coinBalance={coinBalance}
            onPlay={startQuiz}
            onOpenShop={() => setScreen("shop")}
            sound={sound}
          />
        )}

        {screen === "shop" && (
          <ShopScreen
            avatar={avatar}
            setAvatar={setAvatar}
            unlockedAvatars={unlockedAvatars}
            coinBalance={coinBalance}
            onUnlock={unlockAvatar}
            sound={sound}
          />
        )}

        {screen === "quiz" && subject && question && (
          <QuizScreen
            subject={subject}
            question={question}
            qIndex={qIndex}
            total={total}
            triedWrong={triedWrong}
            streak={streak}
            runCoins={runCoins}
            solved={solved}
            feedback={feedback}
            confettiKey={confettiKey}
            avatar={avatar}
            onSelect={handleSelect}
            onNext={goNext}
          />
        )}

        {screen === "result" && subject && (
          <ResultScreen
            subject={subject}
            correctCount={correctCount}
            total={total}
            runCoins={runCoins}
            bestStreak={bestStreak}
            avatar={avatar}
            onRetry={() => startQuiz(subject.id)}
            onHome={goHome}
            onShop={() => setScreen("shop")}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- HOME ---------------------------------- */

function HomeScreen({ avatar, unlockedAvatars, setAvatar, bestBySubject, totalStarsEarned, maxStars, coinBalance, onPlay, onOpenShop, sound }) {
  return (
    <div className="qq-pop">
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h1 className="qq-display" style={styles.h1}>Quiz Quest</h1>
        <p className="qq-body" style={styles.subtitle}>Choose a world, answer questions, earn stars and coins!</p>
      </div>

      {/* Avatar picker + shop link */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {unlockedAvatars.map((a) => (
          <button
            key={a}
            className="qq-btn"
            onClick={() => { sound("click"); setAvatar(a); }}
            style={{
              ...styles.avatarButton,
              background: a === avatar ? "#FFF3D6" : "#FFFFFF",
              borderColor: a === avatar ? "#F2A93B" : "#E7E2D6",
              transform: a === avatar ? "scale(1.08)" : "scale(1)",
            }}
            aria-label={`Choose avatar ${a}`}
          >
            <span style={{ fontSize: 26 }}>{a}</span>
          </button>
        ))}
        <button className="qq-btn" onClick={onOpenShop} style={styles.shopButton} aria-label="Open reward shop">
          <Gift size={22} color="#8B5FBF" />
        </button>
      </div>

      {/* Session progress */}
      <div style={styles.progressCard}>
        <div className="qq-body" style={{ fontWeight: 800, color: "#1F2D50", fontSize: 14 }}>
          {avatar} Your stars this session
        </div>
        <div style={styles.progressBarTrack}>
          <div style={{ ...styles.progressBarFill, width: `${Math.min(100, (totalStarsEarned / maxStars) * 100)}%` }} />
        </div>
        <div className="qq-body" style={{ fontSize: 13, color: "#5A6A8C", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
          <span>{totalStarsEarned} / {maxStars} stars collected</span>
          <span style={{ fontWeight: 800, color: "#B8791E" }}>🪙 {coinBalance} coins</span>
        </div>
      </div>

      {/* Subject grid */}
      <div style={styles.grid}>
        {SUBJECTS.map((s) => {
          const best = bestBySubject[s.id] || 0;
          return (
            <button
              key={s.id}
              className="qq-btn qq-tile"
              onClick={() => onPlay(s.id)}
              style={{ ...styles.tile, background: s.color, border: "none", textAlign: "left" }}
            >
              <div className="qq-tile-inner" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ fontSize: 34, marginBottom: 6 }}>{s.emoji}</div>
                <div className="qq-display" style={styles.tileTitle}>{s.name}</div>
                <div className="qq-body" style={styles.tileTagline}>{s.tagline}</div>
                <div style={{ flexGrow: 1 }} />
                <div style={styles.tileFooter}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Star key={i} size={12} color="#FFFFFF" fill={i < best ? "#FFFFFF" : "transparent"} strokeWidth={2} />
                    ))}
                  </div>
                  <span className="qq-display" style={styles.playLabel}>Play <ArrowRight size={14} style={{ verticalAlign: "-2px" }} /></span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------- SHOP ---------------------------------- */

function ShopScreen({ avatar, setAvatar, unlockedAvatars, coinBalance, onUnlock, sound }) {
  return (
    <div className="qq-pop">
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 44 }}>🎁</div>
        <h1 className="qq-display" style={{ ...styles.h1, fontSize: 26 }}>Reward Shop</h1>
        <p className="qq-body" style={styles.subtitle}>Spend the coins you earned to unlock new buddies!</p>
        <div style={{ ...styles.pointsPill, display: "inline-flex", marginTop: 8 }}>
          <Coins size={18} color="#F2A93B" />
          <span className="qq-display" style={styles.pointsText}>{coinBalance} coins</span>
        </div>
      </div>

      <div style={styles.shopGrid}>
        {SHOP_AVATARS.map((item) => {
          const owned = unlockedAvatars.includes(item.emoji);
          const canAfford = coinBalance >= item.cost;
          return (
            <div key={item.emoji} style={styles.shopCard}>
              <div style={{ fontSize: 38 }}>{item.emoji}</div>
              {owned ? (
                <button
                  className="qq-btn"
                  onClick={() => { sound("click"); setAvatar(item.emoji); }}
                  style={{ ...styles.nextButton, background: item.emoji === avatar ? "#4CAF7D" : "#EAF7E9", marginTop: 8 }}
                >
                  <span className="qq-display" style={{ color: item.emoji === avatar ? "#fff" : "#3B9367", fontWeight: 700, fontSize: 13 }}>
                    {item.emoji === avatar ? "Equipped" : "Choose"}
                  </span>
                </button>
              ) : (
                <button
                  className="qq-btn"
                  onClick={() => onUnlock(item)}
                  disabled={!canAfford}
                  style={{ ...styles.nextButton, background: canAfford ? "#8B5FBF" : "#E7E2D6", marginTop: 8, cursor: canAfford ? "pointer" : "not-allowed" }}
                >
                  {!canAfford && <Lock size={13} color="#8A8A8A" />}
                  <span className="qq-display" style={{ color: canAfford ? "#fff" : "#8A8A8A", fontWeight: 700, fontSize: 13 }}>
                    {item.cost} 🪙
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------- VISUALS ---------------------------------- */

function ShapeSVG({ shape, color }) {
  const common = { viewBox: "0 0 100 100", width: 82, height: 82 };
  switch (shape) {
    case "circle": return <svg {...common}><circle cx="50" cy="50" r="42" fill={color} /></svg>;
    case "square": return <svg {...common}><rect x="14" y="14" width="72" height="72" rx="10" fill={color} /></svg>;
    case "triangle": return <svg {...common}><polygon points="50,10 92,88 8,88" fill={color} /></svg>;
    case "star": return <svg {...common}><polygon points="50,4 61,37 97,37 68,58 79,92 50,71 21,92 32,58 3,37 39,37" fill={color} /></svg>;
    case "rectangle": return <svg {...common}><rect x="6" y="26" width="88" height="48" rx="10" fill={color} /></svg>;
    case "heart": return <svg {...common}><path d="M50,88 C22,64 6,44 6,27 C6,12 18,2 32,4 C42,6 48,15 50,20 C52,15 58,6 68,4 C82,2 94,12 94,27 C94,44 78,64 50,88 Z" fill={color} /></svg>;
    case "pentagon": return <svg {...common}><polygon points="50,6 93,37 77,90 23,90 7,37" fill={color} /></svg>;
    case "oval": return <svg {...common}><ellipse cx="50" cy="50" rx="44" ry="30" fill={color} /></svg>;
    default: return null;
  }
}

function QuestionVisual({ visual, subjectColor, animKey }) {
  return (
    <div key={animKey} className="qq-visual-pop" style={{ ...styles.visualFrame, background: subjectColor + "16", borderColor: subjectColor + "45" }}>
      {visual.type === "emoji" && <span style={{ fontSize: 62 }}>{visual.value}</span>}
      {visual.type === "emojiGroup" && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, maxWidth: 230 }}>
          {Array.from({ length: visual.count }).map((_, i) => (
            <span key={i} style={{ fontSize: 28 }}>{visual.value}</span>
          ))}
        </div>
      )}
      {visual.type === "color" && (
        <div style={{ width: 82, height: 82, borderRadius: 18, background: visual.value, border: visual.value.toUpperCase() === "#FFFFFF" ? "3px solid #D8D3C6" : "3px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 0 rgba(0,0,0,0.08)" }} />
      )}
      {visual.type === "shape" && <ShapeSVG shape={visual.value} color={visual.color} />}
      {visual.type === "mathPic" && (
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: 3, maxWidth: 260 }}>
          {Array.from({ length: visual.a }).map((_, i) => (<span key={"a" + i} style={{ fontSize: 24 }}>{visual.emoji}</span>))}
          <span className="qq-display" style={{ fontSize: 28, fontWeight: 800, color: "#1F2D50", margin: "0 8px" }}>{visual.op}</span>
          {Array.from({ length: visual.b }).map((_, i) => (<span key={"b" + i} style={{ fontSize: 24 }}>{visual.emoji}</span>))}
        </div>
      )}
      {visual.type === "equation" && (
        <span className="qq-display" style={{ fontSize: 36, fontWeight: 800, color: "#1F2D50" }}>{visual.text}</span>
      )}
    </div>
  );
}

/* ---------------------------------- QUIZ ---------------------------------- */

function QuizScreen({ subject, question, qIndex, total, triedWrong, streak, runCoins, solved, feedback, confettiKey, avatar, onSelect, onNext }) {
  const attemptsLeft = MAX_ATTEMPTS - triedWrong.length;

  return (
    <div className="qq-pop">
      {/* Progress path */}
      <div style={styles.pathRow}>
        {Array.from({ length: total }).map((_, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                ...styles.pathDot,
                background: i < qIndex ? subject.dark : i === qIndex ? subject.color : "#FFFFFF",
                borderColor: i === qIndex ? subject.dark : "#E7E2D6",
                transform: i === qIndex ? "scale(1.25)" : "scale(1)",
              }}
              className={i === qIndex ? "qq-bounce" : ""}
            />
            {i < total - 1 && <div style={{ ...styles.pathLine, background: i < qIndex ? subject.dark : "#E7E2D6" }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Status row: attempts left, streak, coins */}
      <div style={styles.statusRow}>
        <div style={{ display: "flex", gap: 4 }} title="Chances left on this question">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <span key={i} style={{ fontSize: 16, opacity: i < attemptsLeft ? 1 : 0.25 }}>🪙</span>
          ))}
        </div>
        {streak >= 2 && (
          <div className="qq-body qq-glow-in" style={styles.streakPill}>🔥 {streak} streak</div>
        )}
        <div className="qq-display" style={{ color: "#1F2D50", fontWeight: 800, fontSize: 14 }}>+{runCoins} 🪙</div>
      </div>

      {/* Question card */}
      <div style={{ ...styles.card, borderColor: subject.color }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div
            className={feedback === "correct" ? "qq-bounce" : feedback === "wrong" || feedback === "revealed" ? "qq-shake" : "qq-mascot-idle"}
            style={{ ...styles.mascotBubble, background: subject.color + "22" }}
          >
            <span style={{ fontSize: 28 }}>{avatar}</span>
          </div>
          <div>
            <div className="qq-body" style={{ fontSize: 12, fontWeight: 800, color: subject.dark, letterSpacing: 0.3 }}>
              {subject.emoji} {subject.name} · Question {qIndex + 1} of {total}
            </div>
          </div>
        </div>

        <QuestionVisual visual={question.visual} subjectColor={subject.color} animKey={qIndex} />

        <h2 className="qq-display" style={styles.questionText}>{question.prompt}</h2>

        <div style={styles.optionsGrid}>
          {question.options.map((opt, i) => {
            const isCorrectOption = i === question.correct;
            const wasTried = triedWrong.includes(i);
            let bg = "#FFFFFF";
            let borderColor = "#E7E2D6";
            let textColor = "#1F2D50";

            if (solved && isCorrectOption) {
              bg = "#E7F7EF";
              borderColor = "#4CAF7D";
            } else if (wasTried) {
              bg = "#FDECEA";
              borderColor = "#FF6F59";
              textColor = "#9AA3B5";
            } else if (solved) {
              bg = "#FAFAF8";
              textColor = "#9AA3B5";
            }

            return (
              <button
                key={i}
                className="qq-btn"
                disabled={solved || wasTried}
                onClick={() => onSelect(i)}
                style={{ ...styles.optionButton, background: bg, borderColor, color: textColor, cursor: solved || wasTried ? "default" : "pointer" }}
              >
                <span className="qq-body" style={{ fontWeight: 700, fontSize: 15.5 }}>{opt}</span>
                {solved && isCorrectOption && <Check size={18} color="#4CAF7D" strokeWidth={3} />}
                {wasTried && !isCorrectOption && <X size={18} color="#FF6F59" strokeWidth={3} />}
                {solved && isCorrectOption && feedback === "correct" && <Confetti key={confettiKey} color={subject.color} />}
              </button>
            );
          })}
        </div>

        <div className="qq-pop" style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 40, flexWrap: "wrap", gap: 8 }}>
          <span className="qq-body" style={{ fontWeight: 800, fontSize: 14, color: feedback === "correct" ? "#3B9367" : feedback === "wrong" ? "#B8791E" : feedback === "revealed" ? "#E0503D" : "transparent" }}>
            {feedback === "correct" && "Nice one! That's right. 🎉"}
            {feedback === "wrong" && `Not quite — ${attemptsLeft} more ${attemptsLeft === 1 ? "try" : "tries"}!`}
            {feedback === "revealed" && "So close! Here's the right answer."}
          </span>
          {solved && (
            <button className="qq-btn" onClick={onNext} style={{ ...styles.nextButton, background: subject.color }}>
              <span className="qq-display" style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                {qIndex === total - 1 ? "See results" : "Next"}
              </span>
              <ArrowRight size={16} color="#fff" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Confetti({ color }) {
  const pieces = Array.from({ length: 10 });
  return (
    <>
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const dist = 40 + (i % 3) * 12;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 10;
        const rot = (i * 47) % 360;
        return (
          <span
            key={i}
            style={{
              position: "absolute", left: "50%", top: "50%", width: 6, height: 6,
              borderRadius: i % 2 === 0 ? "50%" : 2,
              background: i % 3 === 0 ? color : i % 3 === 1 ? "#F2A93B" : "#FFFFFF",
              border: i % 3 === 1 ? "none" : `1px solid ${color}`,
              pointerEvents: "none",
              "--tx": `${tx}px`, "--ty": `${ty}px`, "--rot": `${rot}deg`,
              animation: "qq-confetti 0.7s ease-out forwards",
            }}
          />
        );
      })}
    </>
  );
}

/* ---------------------------------- RESULT ---------------------------------- */

function ResultScreen({ subject, correctCount, total, runCoins, bestStreak, avatar, onRetry, onHome, onShop }) {
  const badge = badgeForScore(correctCount, total);

  return (
    <div className="qq-pop" style={{ ...styles.card, borderColor: subject.color, textAlign: "center", paddingTop: 30, paddingBottom: 30 }}>
      <div className="qq-glow-in" style={{ fontSize: 64, marginBottom: 4 }}>{badge.emoji}</div>
      <h2 className="qq-display" style={{ ...styles.h1, fontSize: 26, marginBottom: 2 }}>{badge.label}</h2>
      <p className="qq-body" style={{ color: "#5A6A8C", marginBottom: 18 }}>
        {avatar} You answered {correctCount} out of {total} correctly in {subject.name}.
      </p>

      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <Star size={20} color="#F2A93B" fill="#F2A93B" />
          <span className="qq-display" style={styles.statNum}>{correctCount}</span>
          <span className="qq-body" style={styles.statLabel}>Stars</span>
        </div>
        <div style={styles.statBox}>
          <Coins size={20} color="#8B5FBF" />
          <span className="qq-display" style={styles.statNum}>{runCoins}</span>
          <span className="qq-body" style={styles.statLabel}>Coins earned</span>
        </div>
        <div style={styles.statBox}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <span className="qq-display" style={styles.statNum}>{bestStreak}</span>
          <span className="qq-body" style={styles.statLabel}>Best streak</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
        <button className="qq-btn" onClick={onRetry} style={{ ...styles.nextButton, background: subject.color, padding: "12px 20px" }}>
          <RotateCcw size={16} color="#fff" />
          <span className="qq-display" style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Play again</span>
        </button>
        <button className="qq-btn" onClick={onShop} style={{ ...styles.nextButton, background: "#8B5FBF", padding: "12px 20px" }}>
          <Gift size={16} color="#fff" />
          <span className="qq-display" style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Reward shop</span>
        </button>
        <button className="qq-btn" onClick={onHome} style={{ ...styles.pillButton, padding: "12px 20px" }}>
          <Home size={16} color="#1F2D50" />
          <span className="qq-body" style={{ ...styles.pillText, fontSize: 14 }}>Choose another world</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- STYLES ---------------------------------- */

const styles = {
  page: {
    minHeight: "100vh", width: "100%",
    background: "linear-gradient(180deg, #6EC6FF 0%, #BDEBFF 55%, #EAF7E9 100%)",
    position: "relative", overflow: "hidden", padding: "20px 12px 40px", boxSizing: "border-box",
  },
  skyDecor: { position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" },
  sun: { position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, #FFE27A 0%, #FFD23F 60%, rgba(255,210,63,0) 75%)" },
  cloud: { position: "absolute", height: 22, borderRadius: 20, background: "#FFFFFF" },
  container: { maxWidth: 480, margin: "0 auto", position: "relative", zIndex: 1 },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 8 },
  pillButton: { display: "flex", alignItems: "center", gap: 6, background: "#FFFFFF", border: "2px solid #E7E2D6", borderRadius: 999, padding: "8px 14px", boxShadow: "0 2px 0 rgba(31,45,80,0.08)" },
  pillText: { fontWeight: 800, fontSize: 13, color: "#1F2D50" },
  pointsPill: { display: "flex", alignItems: "center", gap: 6, background: "#FFF3D6", border: "2px solid #F2A93B", borderRadius: 999, padding: "8px 16px", boxShadow: "0 2px 0 rgba(31,45,80,0.08)" },
  pointsText: { fontWeight: 800, fontSize: 15, color: "#1F2D50" },
  h1: { fontSize: 34, color: "#1F2D50", margin: 0, fontWeight: 800 },
  subtitle: { color: "#3E5273", fontSize: 15, marginTop: 4 },
  avatarButton: { width: 52, height: 52, borderRadius: "50%", border: "3px solid #E7E2D6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 0 rgba(31,45,80,0.08)" },
  shopButton: { width: 52, height: 52, borderRadius: "50%", border: "3px dashed #8B5FBF", background: "#F4EEFB", display: "flex", alignItems: "center", justifyContent: "center" },
  progressCard: { background: "#FFFFFF", borderRadius: 20, border: "2px solid #E7E2D6", padding: "14px 16px", marginBottom: 18 },
  progressBarTrack: { height: 10, background: "#F0EEE6", borderRadius: 999, marginTop: 8, overflow: "hidden" },
  progressBarFill: { height: "100%", background: "linear-gradient(90deg, #F2A93B, #FFD23F)", borderRadius: 999, transition: "width 0.4s ease" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  tile: { borderRadius: 22, padding: 16, height: 168, boxShadow: "0 4px 0 rgba(0,0,0,0.14)" },
  tileTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: 800, lineHeight: 1.15 },
  tileTagline: { color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 3, lineHeight: 1.3 },
  tileFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  playLabel: { color: "#FFFFFF", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 },

  shopGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  shopCard: { background: "#FFFFFF", border: "2px solid #E7E2D6", borderRadius: 20, padding: "16px 10px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },

  pathRow: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, padding: "0 4px" },
  pathDot: { width: 14, height: 14, borderRadius: "50%", border: "2px solid", flexShrink: 0, transition: "transform 0.2s ease" },
  pathLine: { height: 3, flex: 1, maxWidth: 22, margin: "0 3px", borderRadius: 2 },

  statusRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 4px" },
  streakPill: { background: "#FFF3D6", border: "1.5px solid #F2A93B", borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 800, color: "#B8791E" },

  card: { background: "#FFFFFF", borderRadius: 26, border: "3px solid", padding: 20, boxShadow: "0 6px 0 rgba(0,0,0,0.08)" },
  mascotBubble: { width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  visualFrame: { width: "100%", minHeight: 128, borderRadius: 20, border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, padding: 12, boxSizing: "border-box" },
  questionText: { fontSize: 19, color: "#1F2D50", lineHeight: 1.35, margin: "0 0 16px 0", fontWeight: 700, textAlign: "center" },
  optionsGrid: { display: "flex", flexDirection: "column", gap: 10 },
  optionButton: { position: "relative", overflow: "visible", border: "2.5px solid", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" },
  nextButton: { display: "flex", alignItems: "center", gap: 6, border: "none", borderRadius: 999, padding: "10px 18px", boxShadow: "0 3px 0 rgba(0,0,0,0.15)" },
  statsRow: { display: "flex", justifyContent: "center", gap: 10 },
  statBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "#FAFAF8", border: "2px solid #E7E2D6", borderRadius: 16, padding: "12px 18px", minWidth: 82 },
  statNum: { fontSize: 20, fontWeight: 800, color: "#1F2D50" },
  statLabel: { fontSize: 11, color: "#5A6A8C", fontWeight: 700 },
};
