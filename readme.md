# Kline By Minute

## HTTP endpoint

Example GET:

```
-> curl http://localhost:8008/ETHUSD/26648642
<- 25011200000,2165.46000000,2287.78000000,2087.99000000,2275.68000000,910583.60320000,1625097599999,1973676680.87312690,1464112,455834.94051000,988252389.85378930,0,1982.5714285714287,2384.866666666667
```

## Fields
Field name | Example Value
---|---
Open time | 1598918520000
Open | 434.71000000
High | 435.24000000
Low | 434.71000000
Close | 434.86000000
Volume | 501.72752000
Close time | 1598918579999
Quote asset volume | 218241.13816760
Number of trades | 271
Taker buy base asset volume | 151.42315000
Taker buy quote asset volume | 65864.26898090
Ignore | 0
7 day moving average | 1982.5714285714287
30 day moving average | 2384.866666666667

X day moving average is the average of the last X days' open/close averages, including the selected day.

## Scripts

### Setup
KBM doesn't need built. Just [install deno](https://deno.land/#installation).

### Start
Cache Kline data and run server.
Args:

1. Comma separated symbol list; append $ to symbol to clear data and recache
	* Defaults to ETHUSDT
2. Port
	* Defaults to 8008

##### Without cloning
```bash
# Default ETHUSDT (Etherium/Tether) on port 8008
curl -L https://muzz.in/deno | sh -s uncloned

# Load Etherium, force reload Bitcoin, run on port 1234
curl -L https://muzz.in/deno | sh -s uncloned ETHUSDT,BTCUSDT$ 1234
```

##### When cloned
```bash
# Default ETHUSDT on port 8008
./deno.sh start

# Load ETHUSDT, force reload BTCUSDT, run on port 1234
./deno.sh start ETHUSDT,BTCUSDT$ 1234
```

### Clean
Removes cached data
```bash
./deno.sh clean
```