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

    pub fn fuzzy_search(&self, pattern_list: &str) -> JsValue {
        let _timer = Timer::new("wasm-search-call");
        let pattern_list_vec = pattern_list
            .split_whitespace()
            .map(|pattern| pattern.chars().collect())
            .collect::<Vec<Vec<char>>>();
        let mut res = vec![];
        for value in self.map.values() {
            let search_result = Self::search(&pattern_list_vec, value);
            if search_result.matching {
                res.push(search_result);
            }
        }
        let _timer2 = Timer::new("wasm-serde");
        JsValue::from_serde(&res).unwrap()
    }
    #[inline]
    fn search(pattern_list: &Vec<Vec<char>>, source: &Vec<char>) -> SearchResult {
        let pattern_len = pattern_list.iter().fold(0, |pre, cur| pre + cur.len());
        let source_len = source.len();
        if pattern_len > source_len {
            return SearchResult {
                matching: false,
                indexList: vec![],
            };
        }
        let mut index_list: Vec<usize> = vec![];
        let mut j = 0;
        for pattern in pattern_list.iter() {
            // let ref pattern = pattern_list[i];
            'second: for nch in pattern {
                while j < source_len {
                    if source[j] == *nch {
                        index_list.push(j);
                        j += 1;
                        continue 'second;
                    }
                    j += 1;
                }
                return SearchResult {
                    matching: false,
                    indexList: vec![],
                };
            }
        }
        SearchResult {
            matching: true,
            indexList: index_list,
        }
    }
}
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct SearchResult {
    matching: bool,
    indexList: Vec<(usize, usize)>,
}