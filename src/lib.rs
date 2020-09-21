mod utils;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
use std::collections::HashMap;
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
pub struct FuzzySearch {
    map: HashMap<String, Vec<char>>,
}
#[wasm_bindgen]
impl FuzzySearch {
    #[wasm_bindgen(constructor)]
    pub fn new() -> FuzzySearch {
        FuzzySearch {
            map: HashMap::new(),
        }
    }

    pub fn insert(&mut self, key: String, value: String) {
        let value_vec = value.to_lowercase().chars().collect();
        self.map.insert(key, value_vec);
    }

    pub fn fuzzy_search(&self, pattern_list: String) -> JsValue {
        // Timer::new("wasm-search");
        let pattern_list_vec = pattern_list
            .split_whitespace()
            .map(|pattern| pattern.chars().collect())
            .collect::<Vec<Vec<char>>>();
        for value in self.map.values() {
            Self::search(&pattern_list_vec, value);
        }
        JsValue::from_serde(&Test {
            a: 0 as usize,
            source: pattern_list,
        })
        .unwrap()
    }
    #[inline]
    fn search(pattern_list: &Vec<Vec<char>>, source: &Vec<char>) -> bool {
        let pattern_len = pattern_list.iter().fold(0, |pre, cur| pre + cur.len());
        let source_len = source.len();
        if pattern_len > source_len {
            return false;
        }
        // let pattern_list_length = pattern_list.len();
        let mut index_list: Vec<usize> = vec![];
        let mut j = 0;
        for pattern in pattern_list.iter() {
            // let ref pattern = pattern_list[i];
            'second: for i in 0..pattern.len() {
                let nch = pattern[i];
                while j < source_len {
                    if source[j] == nch {
                        index_list.push(j);
                        j += 1;
                        continue 'second;
                    }
                    j += 1;
                }
                return false;
            }
        }
        true
    }
}
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Test {
    a: usize,
    // b: Vec<String>,
    source: String,
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
