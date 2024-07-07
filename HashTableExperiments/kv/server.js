const crypto = require("node:crypto");

// we store all values in the array
const array = [];

// the array must not be longer than x slots
const slots = 200;

// we hash with SHA-256 and convert it into a hex string
const hash = (key) => {
  return crypto
    .createHash("sha256")
    .update(key, "utf8")
    .digest()
    .toString("hex");
};

// find the correct slot (array index) for the key
const slot = (key) => {
  // hash the key into a hey string
  const hashedKey = hash(key);

  // find position in hashspace = 256-bit integer with SHA-256
  // max position here is 2^256, min is 0
  const position = parseInt(hashedKey, 16);

  // map the position into one of our slots by taking
  // the module (the remainder of a division)
  // always gives a number between 0 and slots-1
  const mappedSlot = position % slots;

  console.log({
    key: key,
    hashedKey: hashedKey,
    position: position,
    slot: mappedSlot,
  });

  return mappedSlot;
};

// sets a value for a key
const set = (key, value) => {
  console.log(`set ${key} -> ${value}`);
  array[slot(key)] = value;
};

// gets a value at a key
const get = (key) => {
  console.log(`get ${key}`);
  return array[slot(key)];
};

// let's store the age of some people
set("bob", 21);
set("alice", 24);
set("eve", 19);

// let's lookup the age of some people
console.log(get("bob"));
console.log(get("alice"));
console.log(get("eve"));

// let's have a look at our array
console.log(array);
