function aFunc(value, callback) {
  callback(value);
}

function bFunc(value, callback) {
  setTimeout(callback, 0, value);
}

function cb1(value) {
  console.log(value);
}
function cb2(value) {
  console.log(value);
}
function cb3(value) {
  console.log(value);
}
function cb4(value) {
  console.log(value);
}

aFunc(1, cb1);
bFunc(2, cb2);
aFunc(3, cb3);
bFunc(4, cb4);
