export class Ratings {
  static ratings: Array<{ name: string; elo: number }> = [
    { name: '9p', elo: 2940 },
    { name: '8p', elo: 2910 },
    { name: '7p', elo: 2880 },
    { name: '6p', elo: 2850 },
    { name: '5p', elo: 2820 },
    { name: '4p', elo: 2790 },
    { name: '3p', elo: 2760 },
    { name: '2p', elo: 2730 },
    { name: '1p', elo: 2700 },
    { name: '8d', elo: 2800 },
    { name: '7d', elo: 2700 },
    { name: '6d', elo: 2600 },
    { name: '5d', elo: 2500 },
    { name: '4d', elo: 2400 },
    { name: '3d', elo: 2300 },
    { name: '2d', elo: 2200 },
    { name: '1d', elo: 2100 },
    { name: '1k', elo: 2000 },
    { name: '2k', elo: 1900 },
    { name: '3k', elo: 1800 },
    { name: '4k', elo: 1700 },
    { name: '5k', elo: 1600 },
    { name: '6k', elo: 1500 },
    { name: '7k', elo: 1400 },
    { name: '8k', elo: 1300 },
    { name: '9k', elo: 1200 },
    { name: '10k', elo: 1100 },
    { name: '11k', elo: 1000 },
    { name: '12k', elo: 900 },
    { name: '13k', elo: 800 },
    { name: '14k', elo: 700 },
    { name: '15k', elo: 600 },
    { name: '16k', elo: 500 },
    { name: '17k', elo: 400 },
    { name: '18k', elo: 300 },
    { name: '19k', elo: 200 },
    { name: '20k', elo: 100 },
  ];

  static getElo(name: string): number {
    return Ratings.ratings.find((x) => x.name === name).elo;
  }

  static getName(elo: number): string {
    return Ratings.ratings.find((x) => x.elo === elo).name;
  }
}
