



export function ObjectFilter<Type>(obj: { [key: string]: Type }, fn: (value: Type) => boolean) {

    try {
        return Object.keys(obj)
                     .filter(key => obj[key] !== undefined && fn(obj[key]) )
                     .map(key => obj[key]);
    } catch (error) {
        console.error('Error in ObjectFilter : ', error);
        return [];
    }
}


export function ObjectMap<Type>(obj: { [key: string]: Type }, fn: (value: Type) => Type) {
    try {
        return Object.keys(obj)
                     .map(key => obj[key] !== undefined && fn(obj[key]) );
    } catch (error) {
        console.error('Error in ObjectMap : ', error);
        return [];
    }   
}