// import * as wasm from "hello-wasm-pack";

// wasm.greet();
import { fuzzysearch } from './fuzzySearch'
import * as wasm from 'fuzzy-search'

import faker from 'faker'

const input = document.getElementById('input')
const result = document.getElementById('result')

const map = new Map();
const nameList = []
const wasmFuzzySearch = new wasm.FuzzySearch();
input.addEventListener('input', e => {
    const searchList = e.target.value.toLowerCase().split(/\s+/);
    if (!searchList[0]) {
        result.innerHTML = ''
        return
    }
    console.time('search')
    let res = []
    map.forEach((value, key) => {
        const result = fuzzysearch(searchList, value)
        if (result.match) {
            res.push(result)
        }
    })
    // const res = set.map(item => ({ ... })).filter(item => item.match)
    console.timeEnd('search');
    console.time('search-wasm');
    wasmFuzzySearch.fuzzy_search(e.target.value.toLowerCase());
    // const res2 = nameList.map(item => ({ ...wasm.fuzzy_search(e.target.value.toLowerCase(), item) })).filter(item => item.match)
    console.timeEnd('search-wasm');
    const html = res.map(item => {
        let h = []
        let last = 0
        for (let i = 0; i < item.indexList.length; i++) {
            const { start, end } = item.indexList[i];
            h.push(item.name.slice(last, start))
            h.push(`<span class="highlight">${item.name.slice(start, end + 1)}</span>`)
            last = end + 1
        }
        h.push(item.name.slice(last, item.name.length))
        return `<li>${h.join('')}</li>`
    }).join('')

    result.innerHTML = html
})
for (let i = 0; i < 10000; i++) {
    const name = faker.name.findName()
    map.set(i, name)
    wasmFuzzySearch.insert(i.toString(), name)
}
// map.add(77777777, '简爱')
// map.add('简单的爱')
// map.add('海王')
// set.add('dale thieldale thiel')
// set.add('blanche cummeratablanche cummerata')
// nameList.push(...set)
// nameList.push(...map)