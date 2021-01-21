/**
 * 
 * @param {string[]} patternList 
 * @param {string} source 
 */
export function fuzzysearch(patternList, source) {
  source = source.toLowerCase()
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
  return { match: true, indexList: merge(indexList,), index: indexList, name: source };
}

// matchEqual(fuzzysearch(['car', 'eel'], 'cartwheel'), true);
// matchEqual(fuzzysearch(['cwhl'], 'cartwheel'), true);
// matchEqual(fuzzysearch(['cwheel'], 'cartwheel'), true);
// matchEqual(fuzzysearch(['cartwheel'], 'cartwheel'), true);

// matchEqual(fuzzysearch(['cwheeel'], 'cartwheel'), false);
// matchEqual(fuzzysearch(['lw'], 'cartwheel'), false);
// matchEqual(fuzzysearch(['c', 'a', 'r', 't', 'w', 'h', 'e', 'e', 'l'], 'cartwheel'), true);

// // chinese unicode testcase
// matchEqual(fuzzysearch(['语言'], 'php语言'), true);
// matchEqual(fuzzysearch(['hp语'], 'php语言'), true);
// matchEqual(fuzzysearch(['Py开发'], 'Python开发者'), true);
// matchEqual(fuzzysearch(['Py 开发'], 'Python开发者'), false);
// matchEqual(fuzzysearch(['爪哇进阶'], '爪哇开发进阶'), true);
// matchEqual(fuzzysearch(['格式工具'], '非常简单的格式化工具'), true);
// matchEqual(fuzzysearch(['正则'], '学习正则表达式怎么学习'), true);
// matchEqual(fuzzysearch(['学习正则'], '正则表达式怎么学习'), false);

function matchEqual(a, b) {
  console.log(a);
  console.assert(a.match === b);
}

function merge(indexList) {
  let start = 0;
  let end = 0;
  const res = []
  while (end < indexList.length) {
    if (start === end || indexList[end] - indexList[end - 1] === 1) {
      end += 1;
    } else {
      res.push({ start: indexList[start], end: indexList[end - 1] });
      start = end;
    }
  }
  if (end === indexList.length) {
    res.push({ start: indexList[start], end: indexList[end - 1] });
  }
  return res;
}
// const res = fuzzysearch(['ss'], 'lewiss sstracke iv')
// console.log(fuzzysearch(['thie'], 'dale thieldale thiel'))
// console.log(res);
// console.log(merge([1, 3, 5, 7, 8, 10]));