import { fuzzysearch } from "./fuzzySearch";
import init, { FuzzySearch } from "../pkg/fuzzy_search";
import faker from "faker";

(async () => {
  let wasm = await init();
  const input = document.getElementById("input");
  const result = document.getElementById("result");
  const js = document.getElementById("js");
  const wasmDom = document.getElementById("wasm");
  const map = new Map();
  const nameList = [];
  const wasmFuzzySearch = new FuzzySearch();
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
  // map.add('海王')
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
    // console.time('search')
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
      console.log("js-perf", jsPerf);
    }

    let timeWasmSearch = performance.now();
    wasmFuzzySearch.fuzzy_search(val.toLowerCase())
    // const res2 = nameList.map(item => ({ ...wasm.fuzzy_search(e.target.value.toLowerCase(), item) })).filter(item => item.match)
    const wasmPerf = performance.now() - timeWasmSearch;
    if (insertPerfToDom) {
      wasmDom.innerHTML = wasmPerf;
    } else {
      console.log("wasm-perf: ", wasmPerf);
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

  for (let i = 0; i < 100; i++) {
    const [js, wasm] = execSearch("a".repeat((i % 5) + 1), false);
    jsTotal += js;
    wasmTotal += wasm;
  }

  console.log("wasm-total: ", wasmTotal);
  console.log("js-total", jsTotal);
})();
