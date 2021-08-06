export const download = async (symbol: string) => {
  console.log("Downloading historical data...");
  const ziplist = (await (await fetch(
    `https://s3-ap-northeast-1.amazonaws.com/data.binance.vision?delimiter=/&prefix=data/spot/monthly/klines/${symbol}/1d/`,
  )).text()).match(
    new RegExp(
      `data/spot/monthly/klines/${symbol}/1d/${symbol}-1d-[0-9]{4}-[0-9]{2}\.zip<`,
      "g",
    ),
  )?.map((path) =>
    `https://data.binance.vision/${path.substr(0, path.length - 1)}`
  );
  if (!ziplist) return;
  console.log("over", ziplist);
  await Promise.all(ziplist.map(async (path) => {
    const matches = path.match(/([0-9]{4})-([0-9]{2})/);
    if (!matches) return;
    const [, year, month] = matches;
    console.log("Downloading", symbol, year, month);
    const fname = `./data/${symbol}/${year}-${month}`;
    const blob = (await fetch(
      path,
    )).blob();
    const data = new Uint8Array(await (await blob).arrayBuffer());
    await Deno.writeFile(fname + ".zip", data);
    await Deno.run({
      cmd: ["unzip", fname + ".zip", "-d", "data/" + symbol],
      stdout: "piped",
      stderr: "piped",
    }).status();
    await Deno.remove(fname + ".zip");
  }));
};
