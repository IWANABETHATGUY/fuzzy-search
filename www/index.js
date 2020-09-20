// import * as wasm from "hello-wasm-pack";

// wasm.greet();
import { fuzzysearch } from './fuzzySearch'
import * as wasm from 'fuzzy-search'

import faker from 'faker'

const input = document.getElementById('input')
const result = document.getElementById('result')

const nameList = []
const res = wasm.fuzzy_search(["fuck", 'test'], "fuck");
console.log(res);
input.addEventListener('input', e => {
    console.time('search')
    const searchList = e.target.value.toLowerCase().split(/\s+/);
    const res = nameList.map(item => ({ ...fuzzysearch(searchList, item) })).filter(item => item.match)
    console.timeEnd('search');
    console.time('search-wasm');
    const res2 = nameList.map(item => ({ ...wasm.fuzzy_search(searchList, item) })).filter(item => item.match)
    console.timeEnd('search-wasm');
    const html = res.map(item => {
        let h = []
        let last = 0
        for (let i = 0; i < item.indexList.length; i++) {
            const {start, end} = item.indexList[i];
            h.push(item.name.slice(last, start))
            h.push(`<span class="highlight">${item.name.slice(start, end + 1)}</span>`)
            last = end + 1
        }
        h.push(item.name.slice(last, item.name.length))
        return `<li>${h.join('')}</li>`
    }).join('')

    result.innerHTML = html
})
const set = new Set();
for (let i = 0; i < 10000; i++) {
    set.add(faker.name.findName())
}
set.add('简爱')
set.add('简单的爱')
nameList.push(...set)