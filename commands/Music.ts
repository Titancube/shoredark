import { Command, CommandMessage, Infos } from "@typeit/discord";

interface Notes {
  note: string;
  num: number;
}

export abstract class Music {
  // list of all diatonic scales
  static diatonicScale = [
    {
      name: "이오니안",
      scale: [0, 2, 4, 5, 7, 9, 11],
    },
    {
      name: "도리안",
      scale: [0, 2, 3, 5, 7, 9, 10],
    },
    {
      name: "프리지안",
      scale: [0, 1, 3, 5, 7, 8, 10],
    },
    {
      name: "리디안",
      scale: [0, 2, 4, 6, 7, 9, 11],
    },
    {
      name: "믹소리디안",
      scale: [0, 2, 4, 5, 7, 9, 10],
    },
    {
      name: "에올리안",
      scale: [0, 2, 3, 5, 7, 8, 10],
    },
    {
      name: "로크리안",
      scale: [0, 1, 3, 5, 6, 8, 10],
    },
  ];

  static notes = [
    { note: "C", num: 0 },
    { note: "Db", num: 1 },
    { note: "D", num: 2 },
    { note: "Eb", num: 3 },
    { note: "E", num: 4 },
    { note: "F", num: 5 },
    { note: "Gb", num: 6 },
    { note: "G", num: 7 },
    { note: "Ab", num: 8 },
    { note: "A", num: 9 },
    { note: "Bb", num: 10 },
    { note: "B", num: 11 },
  ];

  // static notesNumList = {
  //   0: "C",
  //   1: "Db",
  //   2: "D",
  //   3: "Eb",
  //   4: "E",
  //   5: "F",
  //   6: "Gb",
  //   7: "G",
  //   8: "Ab",
  //   9: "A",
  //   10: "Bb",
  //   11: "B",
  // };

  @Command("스케일 :key :scale")
  @Infos({
    command: `스케일`,
    detail: "`$스케일 <C ~ B> <이오니안 ~ 로크리안>`",
    description:
      "* <C ~ B>: `C` 부터 `B` 까지의 근음을 선택합니다. 플랫만 허용합니다.\n* <도리안 ~ 리디안>: 다음 중 한가지 스케일을 선택합니다.\n```\n이오니안\n도리안\n프리지안\n리디안\n믹소리디안\n에올리안\n로크리안\n```",
  })
  private scale(command: CommandMessage) {
    const key = command.args.key
      ? (command.args.key + "").charAt(0).toUpperCase() +
        (command.args.key + "").slice(1).toLowerCase()
      : "C";
    const scale = command.args.scale ? command.args.scale : "이오니안";

    command.channel.send(
      `근음이 ${key} 일 때의 ${scale} 스케일\n\`${Music.getScale(key, scale)}\``
    );
  }

  private static getNotes(key: string): Array<Notes> {
    const newNotesTemp = [
      ...Music.notes.slice(
        Music.notes.find((e) => e.note === key).num,
        Music.notes.length
      ),
      ...Music.notes.slice(0, Music.notes.find((e) => e.note === key).num),
    ];
    const newNotes = [];
    newNotesTemp.forEach((e) => newNotes.push(e.note));

    return newNotes;
  }

  private static getScale(key: string, scale: string): string {
    const scaleNotesArray = scale
      ? Music.diatonicScale.filter((v) => v.name === scale)[0].scale
      : Music.diatonicScale[0].scale;

    const newNotes = Music.getNotes(key);
    const newScale = [];
    scaleNotesArray.forEach((n) => newScale.push(newNotes[n]));
    return newScale.join(", ");
  }
}
