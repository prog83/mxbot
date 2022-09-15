export default class LetterCaseService {
  static switchCase(text: string) {
    const switchedCase = [...text].map((letter) => {
      const upperLetter = letter.toUpperCase();
      return letter === upperLetter ? letter.toLowerCase() : upperLetter;
    });

    return switchedCase.join('');
  }
}
