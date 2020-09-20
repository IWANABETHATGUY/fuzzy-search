/**
 * 
 * @param {string[]} patternList 
 * @param {string} source 
 */
function fuzzysearch(patternList, source) {
  let sourceLen = source.length;
  let patternLen = patternList.reduce((pre, cur) => { return pre + cur.length }, 0)
  if (patternLen > sourceLen) {
    return false;
  }
  const patternListLength = patternList.length;
  const indexList = []
  first: for (let i = 0, j = 0; i < patternListLength; i++) {
    let pattern = patternList[i];
    second: for (let c = 0; c < pattern.length; c++) {
      let nch = pattern.charCodeAt(c);
      while (j < sourceLen) {
        if (source.charCodeAt(j) === nch) {
          indexList.push(j++);
          continue second;
        }
        j++;
      }
      return { match: false };
    }
  }
  return { match: true, indexList };
}

matchEqual(fuzzysearch(['car', 'eel'], 'cartwheel'), true);
matchEqual(fuzzysearch(['cwhl'], 'cartwheel'), true);
matchEqual(fuzzysearch(['cwheel'], 'cartwheel'), true);
matchEqual(fuzzysearch(['cartwheel'], 'cartwheel'), true);

matchEqual(fuzzysearch(['cwheeel'], 'cartwheel'), false);
matchEqual(fuzzysearch(['lw'], 'cartwheel'), false);
matchEqual(fuzzysearch(['c', 'a', 'r', 't', 'w', 'h', 'e', 'e', 'l'], 'cartwheel'), true);

// chinese unicode testcase
matchEqual(fuzzysearch(['语言'], 'php语言'), true);
matchEqual(fuzzysearch(['hp语'], 'php语言'), true);
matchEqual(fuzzysearch(['Py开发'], 'Python开发者'), true);
matchEqual(fuzzysearch(['Py 开发'], 'Python开发者'), false);
matchEqual(fuzzysearch(['爪哇进阶'], '爪哇开发进阶'), true);
matchEqual(fuzzysearch(['格式工具'], '非常简单的格式化工具'), true);
matchEqual(fuzzysearch(['正则'], '学习正则表达式怎么学习'), true);
matchEqual(fuzzysearch(['学习正则'], '正则表达式怎么学习'), false);

function matchEqual(a, b) {
  console.log(a);
  console.assert(a.match === b);
}