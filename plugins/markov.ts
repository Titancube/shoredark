// https://medium.com/@alexkrameris/markov-chain-implementation-in-javascript-a698f371d66f
// My own implementation in typescript of Alex Kramer's original javascript version
export class Markov {
  private state: string[] = []
  private markovChain: { [index: string]: string[] } = {}

  addState(message: Array<string> | string): void {
    if (Array.isArray(message)) {
      Array.from(message).forEach((word: string) =>
        word
          .split(' ')
          .forEach((char: string) => this.state.push(Markov.trim(char)))
      )
    } else if (typeof message == 'string') {
      message
        .split(' ')
        .forEach((word: string) => this.state.push(Markov.trim(word)))
    }
  }

  static trim(text: string): string {
    return text.toLowerCase().replace(/[\W_]/, '')
  }

  init(): void {
    this.markovChain = {}
  }

  train(): void {
    const textArr = this.state

    for (let i = 0; i < textArr.length; i++) {
      const word = textArr[i].toLowerCase().replace(/[\W_]/, '')
      if (!this.markovChain[word]) {
        this.markovChain[word] = []
      }
      if (textArr[i + 1]) {
        this.markovChain[word].push(
          textArr[i + 1].toLowerCase().replace(/[\W_]/, '')
        )
      }
    }
  }

  generate(count: number): string {
    const words: string[] = Object.keys(this.markovChain)
    let word = words[Math.floor(Math.random() * (words.length ?? 10))]
    let result = ''
    for (let iteration = 0; iteration < count; iteration++) {
      result += word + ' '
      const newWord =
        this.markovChain[word][
          Math.floor(Math.random() * this.markovChain[word].length)
        ]
      word = newWord
      if (!word || !this.markovChain)
        word = words[Math.floor(Math.random() * count)]
    }
    return result
  }

  /**
   * Filters valid sentences to train markov chain
   * @param message unfiltered message history
   * @param count minimum length of the array of message history split by whitespace
   * @returns array of filtered
   */
  static wordsFilter(message: Array<string>, count: number): Array<string> {
    for (let iterator = count; iterator > 0; iterator--) {
      const newArr: Array<string> = message.filter(
        (s) => s.split(' ').length >= iterator
      )
      if (newArr.length >= 5) return newArr
    }
  }
}
