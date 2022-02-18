mod utils;

use fxhash::FxHashMap;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
// #[cfg(feature = "wee_alloc")]
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
// use web_sys::console;

// pub struct Timer<'a> {
//     name: &'a str,
// }

// impl<'a> Timer<'a> {
//     pub fn new(name: &'a str) -> Timer<'a> {
//         console::time_with_label(name);
//         Timer { name }
//     }
// }

// impl<'a> Drop for Timer<'a> {
//     fn drop(&mut self) {
//         console::time_end_with_label(self.name);
//     }
// }
#[wasm_bindgen]
pub struct FuzzySearch {
    map: FxHashMap<String, Vec<u8>>,
}
#[wasm_bindgen]
impl FuzzySearch {
    #[wasm_bindgen(constructor)]
    pub fn new() -> FuzzySearch {
        FuzzySearch {
            map: FxHashMap::default(),
        }
    }

    pub fn insert(&mut self, key: String, value: String) {
        let value_vec = value.to_lowercase().bytes().collect();
        self.map.insert(key, value_vec);
    }

    pub fn fuzzy_search(&self, pattern_list: &str) -> JsValue {
        let pattern_list_vec = pattern_list
            .split_whitespace()
            .map(|pattern| pattern.bytes().collect())
            .collect::<Vec<Vec<u8>>>();
        let mut res: Vec<SearchResult> = Vec::with_capacity(self.map.len());
        let pattern_len = pattern_list_vec.iter().fold(0, |pre, cur| pre + cur.len());
        for value in self.map.values() {
            let source_len = value.len();
            if pattern_len > source_len {
                continue;
            }
            let search_result = Self::search(&pattern_list_vec, value, source_len);
            if search_result.matching {
                res.push(search_result);
            }
        }
        JsValue::from_bool(true)
    }
    #[inline]
    fn search(pattern_list: &Vec<Vec<u8>>, source: &Vec<u8>, source_len: usize) -> SearchResult {
        let mut index_list: Vec<usize> = Vec::with_capacity(source_len);
        let mut j = 0;
        for pattern in pattern_list.iter() {
            // let ref pattern = pattern_list[i];
            'second: for nch in pattern {
                while j < source_len {
                    if unsafe { source.get_unchecked(j) } == nch {
                        index_list.push(j);
                        j += 1;
                        continue 'second;
                    }
                    j += 1;
                }
                return SearchResult {
                    matching: false,
                    index_list: vec![],
                };
            }
        }
        SearchResult {
            matching: true,
            index_list: index_list,
        }
    }
}
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct SearchResult {
    matching: bool,
    index_list: Vec<usize>,
}
