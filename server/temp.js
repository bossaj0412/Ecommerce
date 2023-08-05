var obj={
    name:"aj",
    age:20,
    id:2231313,
    male:1
}

for(const temp in obj){
    if(temp!= "age") delete obj[temp]
}
// f(obj.length === 0)i
console.log(obj.age);