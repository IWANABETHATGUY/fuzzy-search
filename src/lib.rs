mod utils;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
use web_sys::console;

pub struct Timer<'a> {
    name: &'a str,
}

impl<'a> Timer<'a> {
    pub fn new(name: &'a str) -> Timer<'a> {
        console::time_with_label(name);
        Timer { name }
    }
}

impl<'a> Drop for Timer<'a> {
    fn drop(&mut self) {
        console::time_end_with_label(self.name);
    }
}
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Test {
    a: usize,
    b: Vec<String>,
    source: String
}
#[wasm_bindgen]
pub fn fuzzy_search(pattern_list: &JsValue, source: &str) -> JsValue {
    // Timer::new("wasm-search");
    let mut vec: Vec<String> = pattern_list.into_serde().unwrap();
    JsValue::from_serde(&Test {
        a: vec.len() as usize,
        b: vec,
        source: source.into(),
    })
    .unwrap()
}

// export function fuzzysearch(patternList, source) {
//   source = source.toLowerCase()
//   let sourceLen = source.length;
//   let patternLen = patternList.reduce((pre, cur) => { return pre + cur.length }, 0)
//   if (patternLen > sourceLen) {
//     return false;
//   }
//   const patternListLength = patternList.length;
//   const indexList = []
//   first: for (let i = 0, j = 0; i < patternListLength; i++) {
//     let pattern = patternList[i];
//     second: for (let c = 0; c < pattern.length; c++) {
//       let nch = pattern.charCodeAt(c);
//       while (j < sourceLen) {
//         if (source.charCodeAt(j) === nch) {
//           indexList.push(j++);
//           continue second;
//         }
//         j++;
//       }
//       return { match: false };
//     }
//   }
//   return { match: true, indexList: merge(indexList,), index: indexList, name: source };
// }
