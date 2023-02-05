/** @param {Buffer} content */
module.exports = function (content) {
  // from https://github.com/timjacksonm/rle-decoder/blob/main/
  /**
   * Converts a RLE string into a 2d bool array
   * @param {string} str The string to convert
   * @returns {boolean[][]} the state of the cells.
   */
  function decodeRLE (str) {
    function extractKeyValuePairs (string) {
      // format : { x: num, y: num }
      let sizeObject = string.replace(/\s/g, '').split(',')
      sizeObject.length = 2

      for (const sizes in sizeObject) {
        let keyValuePair = Object.fromEntries(
          new URLSearchParams(sizeObject[sizes]).entries()
        )
        keyValuePair[Object.keys(keyValuePair)] = Number(
          Object.values(keyValuePair)
        )
        sizeObject[sizes] = keyValuePair
      }
      sizeObject = { ...sizeObject[0], ...sizeObject[1] }
      return sizeObject
    }

    const array = str.toString().split('\n')
    function sanitize (string) {
      // remove # and letter in the beginning of string
      const stringArray = string.split(' ')
      stringArray.shift()
      // return string without multiline characters
      return stringArray.join(' ').replace(/(\r\n|\n|\r)/gm, '')
    }

    // extract lines from file
    let author = array.filter(line => /\#[O]/g.test(line))
    let title = array.filter(line => /\#[N]/g.test(line))
    let description = array.filter(line => /\#[C]/g.test(line))
    let size = array.filter(
      line => /x = \d/g.test(line) && /y = \d/g.test(line)
    )
    let rleString = array.filter(
      string =>
        !string.includes(' ') &&
        string.includes('b') &&
        string.includes('o') &&
        string.includes('$')
    )

    if (author.length) {
      author = sanitize(author[0])
    } else author = ''

    if (title.length) {
      title = sanitize(title[0])
    } else title = ''

    if (description.length) {
      description = description.map(string => sanitize(string))
    } else description = ''

    if (size.length) {
      size = extractKeyValuePairs(size[0])
    } else size = ''

    if (rleString.length) {
      rleString = rleString.join('').replace(/(\r\n|\n|\r)/gm, '')
    } else rleString = ''

    const { x, y } = size

    // on number repeat next letter number of times.
    // End by splitting on $ creating multiple lines
    let decoded = rleString
      .slice(0, -1)
      .replace(/(\d+)(\D)/g, function (match, num) {
        return match.split(num)[1].repeat(num)
      })
      .split('$')

    // replace letter 'o' with 1's & b with 0's ie - alive: 1 , dead: 0
    decoded = decoded.map(row => row.replace(/o/g, 1))
    decoded = decoded.map(row => row.replace(/b/g, 0))

    // for each row split into its own arrow containing single #'s
    decoded = decoded.map(row => [...row.split('')])

    // row length less than specifications add filler 0's
    decoded = decoded.map(row => {
      if (row.length < x) {
        let filler = new Array(x - row.length).fill(0)
        let value = row.concat(filler)
        return value
      } else {
        return row
      }
    })

    // convert all string numbers to type of Number
    decoded = decoded.map(row => row.map(string => Number(string) == 1))

    return decoded
  }
  return `export default JSON.parse("${JSON.stringify(
    decodeRLE(content.toString('utf-8'))
  )}")`
}
