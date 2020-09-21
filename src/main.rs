fn main() {
    let string = "a   test   test";
    let res: Vec<_> = string.split_whitespace().collect();
    println!("{:?}", res);
    
}