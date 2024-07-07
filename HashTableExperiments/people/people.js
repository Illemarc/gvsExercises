const crypto = require("node:crypto");

// Speichern aller Werte in einem Array von Listen
const array = [];

// Anzahl der Slots im Array
const slots = 200;

// Hashfunktion, die den Schlüssel in einen Hashwert umwandelt
const hash = (key) => {
  return crypto
    .createHash("sha256")
    .update(key, "utf8")
    .digest()
    .toString("hex");
};

// Berechnung des korrekten Slots (Array-Index) für den Schlüssel
const slot = (key) => {
  const hashedKey = hash(key);
  const position = parseInt(hashedKey, 16);
  const mappedSlot = position % slots;

  return mappedSlot;
};

// Setzen eines Werts für einen Schlüssel
const set = (key, value) => {
  const index = slot(key);

  // Initialisiere den Slot, falls er noch nicht existiert
  if (!array[index]) {
    array[index] = [];
  }

  // Überprüfe, ob der Schlüssel bereits existiert und aktualisiere den Wert
  for (let i = 0; i < array[index].length; i++) {
    if (array[index][i].key === key) {
      array[index][i].value = value;
      return;
    }
  }

  // Wenn der Schlüssel nicht existiert, füge ein neues Paar hinzu
  array[index].push({ key, value });
};

// Abrufen eines Werts für einen Schlüssel
const get = (key) => {
  const index = slot(key);

  if (!array[index]) {
    return undefined;
  }

  // Suche nach dem Schlüssel in der Liste
  for (let i = 0; i < array[index].length; i++) {
    if (array[index][i].key === key) {
      return array[index][i].value;
    }
  }

  return undefined;
};

// Testen der Implementierung
set("bob", 21);
set("alice", 24);
set("eve", 19);

// Lookup von Werten
console.log(get("bob")); // 21
console.log(get("alice")); // 24
console.log(get("eve")); // 19

// Weitere Tests mit Kollisionen
set("dave", 30);
console.log(get("dave")); // 30

// Schauen wir uns das Array an
console.log(array);
