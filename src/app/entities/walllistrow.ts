export class WallListRow {
  place: number;
  name: string;
  club: string;
  level: string;
  rating: number;
  score: number;
  results: string;
  points: number;
  scorex: number;
  sos: number;
  sosos: number;
  round: number;

  constructor(row: WallListRow) {
    this.place = row.place;
    this.name = row.name;
    this.club = row.club;
    this.level = row.level;
    this.rating = row.rating;
    this.score = row.score;
    this.results = row.results;
    this.points = row.points;
    this.scorex = row.scorex;
    this.sos = row.sos;
    this.sosos = row.sosos;
    this.round = row.round;
  }

  public static getWallTable(results: string): WallListRow[] {
    const wallList: WallListRow[] = [];
    const resultsTable = results.split(/\n/);
    let roundsPlayed = 0;
    let resRow = {};
    try {
      for (const row of resultsTable) {
        if (row.substr(0, 1) === '[') {
          continue;
        }
        if (row.substr(0, 5) === 'Place') {
          roundsPlayed = (row.indexOf('Points') - 80) / 9 + 1;
        } else {
          const tail = 9 * roundsPlayed;
          const s = row.substr(0, 4).trim();
          let place = '';
          if (s[0] === '(') {
            place = s.substring(1);
          } else {
            place = s;
          }
          if (place) {
            resRow = {
              place: Number(place),
              name: row.substr(6, 36).trim(),
              club: row.substr(43, 7).trim(),
              level: row.substr(51, 6).trim(),
              rating: Number(row.substr(59, 5).trim()),
              score: Number(row.substr(65, 5).trim()),
              results: row.substr(71, tail),
              points: Number(row.substr(73 + tail, 6).trim()),
              scorex: Number(row.substr(79 + tail, 6).trim()),
              sos: Number(row.substr(86 + tail, 6).trim()),
              sosos: Number(row.substr(92 + tail, 6).trim()),
              round: roundsPlayed
            };
            wallList.push(new WallListRow(resRow as WallListRow));
          }
        }
      }
    } catch (err) {
      console.log(err.message);
      return [];
    }
    return wallList;
  }
}

class ResultsList {
  gameResult: string;
}

export class GameResult {
  oponent: number;
  result: string;
}
