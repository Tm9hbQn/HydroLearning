const ITERATIONS = 10_000_000;

console.log(`Running benchmark with ${ITERATIONS} iterations...`);

console.time('Object Inside Loop (Simulating Component Render)');
for (let i = 0; i < ITERATIONS; i++) {
  const colors = {
    vertebra: "#e2e8f0",
    annulus: "#94a3b8",
    nucleus: "#ef4444",
    nerve: "#fbbf24",
    pain: "#facc15"
  };
  // Access a property to prevent optimization (though V8 is smart)
  const v = colors.vertebra;
}
console.timeEnd('Object Inside Loop (Simulating Component Render)');

const staticColors = {
  vertebra: "#e2e8f0",
  annulus: "#94a3b8",
  nucleus: "#ef4444",
  nerve: "#fbbf24",
  pain: "#facc15"
};

console.time('Object Outside Loop (Static Definition)');
for (let i = 0; i < ITERATIONS; i++) {
  const colors = staticColors;
  // Access a property
  const v = colors.vertebra;
}
console.timeEnd('Object Outside Loop (Static Definition)');
