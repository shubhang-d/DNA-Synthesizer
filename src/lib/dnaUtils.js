// DNA utility functions for sequence validation, calculations, parsing, and pricing
// These functions are pure JavaScript and can be imported throughout the app.

/**
 * Validate that a DNA sequence contains only A,T,C,G (case-insensitive).
 * Strips whitespace before checking.
 * @param {string} seq
 * @returns {boolean}
 */
export function validateDNA(seq) {
  if (!seq || typeof seq !== "string") return false;
  const cleaned = seq.replace(/\s+/g, "").toUpperCase();
  return /^[ATCG]*$/.test(cleaned);
}

/**
 * Calculate GC content percentage of a sequence. Returns value between 0 and 100.
 * @param {string} seq
 * @returns {number}
 */
export function calculateGCContent(seq) {
  const cleaned = seq.replace(/\s+/g, "").toUpperCase();
  if (cleaned.length === 0) return 0;
  const gcCount = (cleaned.match(/[GC]/g) || []).length;
  return (gcCount / cleaned.length) * 100;
}

/**
 * Return the reverse complement of a DNA sequence.
 * @param {string} seq
 * @returns {string}
 */
export function getReverseComplement(seq) {
  const complementMap = { A: "T", T: "A", C: "G", G: "C" };
  return seq
    .replace(/\s+/g, "")
    .toUpperCase()
    .split("")
    .reverse()
    .map((n) => complementMap[n] || "")
    .join("");
}

/**
 * Calculate price given sequence length and options (scale, purification, modifiers).
 * This is a simple example; real pricing logic should come from database or config.
 * @param {number} length
 * @param {object} options
 * @returns {number}
 */
export function calculatePrice(length, options = {}) {
  const baseRate = 0.10; // $0.10 per base by default
  let price = length * baseRate;

  // scale modifiers (example)
  if (options.scale === "small") price *= 1;
  if (options.scale === "medium") price *= 0.9;
  if (options.scale === "large") price *= 0.8;

  // purification
  if (options.purification === "hplc") price += 50;
  if (options.purification === "gel") price += 30;

  return Number(price.toFixed(2));
}

/**
 * Parse a FASTA file content and return the sequence(s).
 * Very basic parser: returns an array of { header, sequence } objects.
 * @param {string} text
 * @returns {Array<{header:string,sequence:string}>}
 */
export function parseFasta(text) {
  const lines = text.split(/\r?\n/);
  const results = [];
  let current = null;

  lines.forEach((line) => {
    if (line.startsWith(">")) {
      if (current) results.push(current);
      current = { header: line.slice(1).trim(), sequence: "" };
    } else if (current) {
      current.sequence += line.trim();
    }
  });
  if (current) results.push(current);
  return results;
}
