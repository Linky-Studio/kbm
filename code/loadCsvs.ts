export const loadCsvs = async (symbol: string) => {
  console.log("Loading historical data");
  const path = `data/${symbol}/`;
  const tickers: { [key: string]: string } = {};
  const fileIterator = Deno.readDir(path);
  const flist = [];
  for await (const file of fileIterator) {
    flist.push(file);
  }
  let loaded = 0;
  await Promise.all(
    flist.map(async (fname: Deno.DirEntry) => {
      const file = await Deno.readTextFile(`${path}/${fname.name}`);
      file.trim().split("\n")
        .forEach((line: string) =>
          tickers[parseInt(line.split(",")[0]) / 60000 / 60 / 24] = line
        );
      ++loaded;
      console.log(
        "Loaded",
        loaded,
        "of",
        flist.length,
        symbol,
        ":",
        Math.round((loaded) / flist.length * 100),
        "% complete",
      );
    }),
  );
  const keys = Object.keys(tickers)
    .map((key) => parseInt(key))
    .sort((l, r) => l - r);
  const broken = Object.fromEntries(
    Object.entries(tickers).map(([k, v]) => {
      const [, open, close] = v.split(",");
      return [k, (parseInt(open) + parseInt(close)) / 2];
    }),
  );

  // 7 day
  let movingSum = keys.slice(0, 6).map((key) => broken[key]).reduce((l, r) =>
    l + r
  );
  tickers[keys[6]] += "," + (movingSum / 7);
  for (let k = 7; k < keys.length; k++) {
    movingSum -= broken[keys[k - 7]];
    movingSum += broken[keys[k]];
    tickers[keys[k]] += "," + (movingSum / 7);
  }
  // 30 day
  movingSum = keys.slice(0, 29).map((key) => broken[key]).reduce((l, r) =>
    l + r
  );
  tickers[keys[29]] += "," + (movingSum / 30);
  for (let k = 30; k < keys.length; k++) {
    movingSum -= broken[keys[k - 30]];
    movingSum += broken[keys[k]];
    tickers[keys[k]] += "," + (movingSum / 30);
  }
  console.log("Loaded historical data");
  return tickers;
};

loadCsvs("ETHUSDT");
