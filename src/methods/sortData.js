export default function (array, bySomething) {
  console.log('sortData', bySomething);
  return array.sort((a, b) => {
    return b[bySomething] - a[bySomething];
  });
};
