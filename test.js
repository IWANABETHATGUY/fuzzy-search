// import * as wasm from "hello-wasm-pack";

// wasm.greet();
import { fuzzysearch } from "./fuzzySearch";
import * as wasm from "fuzzy-search";
import { memory } from "../pkg/fuzzy_search_bg";
import faker from "faker";

const input = document.getElementById("input");
const result = document.getElementById("result");
const js = document.getElementById("js");
const wasmDom = document.getElementById("wasm");
const map = new Map();
const nameList = [];
const wasmFuzzySearch = new wasm.FuzzySearch();
input.addEventListener("input", e => {
  execSearch(e.target.value);
});
for (let i = 0; i < 10000; i++) {
  const name = faker.name.findName();
  map.set(i, name);
  wasmFuzzySearch.insert(i.toString(), name);
}
// map.add(77777777, '简爱')
// map.add('简单的爱')
// set.add('dale thieldale thiel')
// set.add('blanche cummeratablanche cummerata')
// nameList.push(...set)
// nameList.push(...map)
function execSearch(val, insertPerfToDom = true) {
  const searchList = val.toLowerCase().split(/\s+/);
  if (!searchList[0]) {
    result.innerHTML = "";
    return;
  }
  let timeSearch = performance.now();
  let res = [];
  map.forEach((value, key) => {
    const result = fuzzysearch(searchList, value);
    if (result.match) {
      res.push(result);
    }
  });
  const jsPerf = performance.now() - timeSearch;
  if (insertPerfToDom) {
    js.innerHTML = jsPerf;
  } else {
    // console.log("js-perf", jsPerf);
  }

  let timeWasmSearch = performance.now();
  //   console.assert(res.length === wasmFuzzySearch.fuzzy_search(e.target.value.toLowerCase()).length);
  const resultPointer = wasmFuzzySearch.fuzzy_search(val.toLowerCase());
  const array = new Uint32Array(memory.buffer, resultPointer.ptr, 3);
  const res2 = new Uint32Array(memory.buffer, array[2], array[1] * 2);
  for (let i = 0; i < res2.length; i += 2) {
    const pointer = res2[i];
    const count = res2[i + 1];
    let a = new Uint32Array(memory.buffer, pointer, count);
    // if (!show) {
    //   show = true;
    // }
  }
  //   console.log(res2);
  //   console.log(array, res.length);
  // const res2 = nameList.map(item => ({ ...wasm.fuzzy_search(e.target.value.toLowerCase(), item) })).filter(item => item.match)
  const wasmPerf = performance.now() - timeWasmSearch;
  if (insertPerfToDom) {
    wasmDom.innerHTML = wasmPerf;
  } else {
    // console.log("wasm-perf: ", wasmPerf);
  }
  if (insertPerfToDom) {
    const html = res
      .map(item => {
        let h = [];
        let last = 0;
        for (let i = 0; i < item.indexList.length; i++) {
          const { start, end } = item.indexList[i];
          h.push(item.name.slice(last, start));
          h.push(`<span class="highlight">${item.name.slice(start, end + 1)}</span>`);
          last = end + 1;
        }
        h.push(item.name.slice(last, item.name.length));
        return `<li>${h.join("")}</li>`;
      })
      .join("");
    result.innerHTML = html;
  }
  if (!insertPerfToDom) {
    return [jsPerf, wasmPerf];
  }
}
let wasmTotal = 0;
let jsTotal = 0;
for (let i = 0; i < 200; i++) {
  const [js, wasm] = execSearch("ab", false);
  wasmTotal += wasm;
  jsTotal += js;
}

console.log("wasmTotal: ", wasmTotal, "jsTotal: ", jsTotal);
