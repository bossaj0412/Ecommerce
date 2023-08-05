// product name search functionality

export const searchApi = (allProduct, str)=>{
    const x=str.keyword
    // console.log(str);
    if(x==undefined)return allProduct;
    const newProduct= allProduct.filter(fun);

    function fun(ind){
        return ind.name.includes(x);
    }
    return newProduct;

}

// category search functionality

export const categoryFilterApi=(allProduct, str)=>{
    // console.log(str);
    // if(str==undefined)return allProduct;// validation 1

    for(const i in str){
        if(i !== "category") delete str[i];
    }

    if(str.category== undefined)return allProduct;// validation 2
    const x=str.category;

    const newProduct= allProduct.filter(fun);

    function fun(ind){
        return ind.category.includes(x);
    }
    return newProduct;



}

// Price filter functionality

export const priceFilter= async (allProduct,str)=>{
    // console.log(str);
    console.log(typeof(allProduct));
    for(const i in str){
        if( !(i.includes("price")) ) delete str[i];
    }
   
    if(str.price == undefined)return allProduct;
    // console.log(str);
    let newStr= JSON.stringify(str);
    newStr = newStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // console.log(str);
    allProduct =  allProduct.find(JSON.parse(newStr))
    // console.log(allProduct);
    // setTimeout(()=>console.log('1'), 2000)
    return allProduct;
}