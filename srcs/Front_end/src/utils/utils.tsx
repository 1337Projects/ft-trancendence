



export function ObjectFilter(obj: { [key: string]: any }, fn: (value: any) => boolean) {

    try {
        return Object.keys(obj)
                     .filter(key => fn(obj[key]) )
                     .map(key => obj[key]);
    } catch (error) {
        console.error('Error in ObjectFilter : ', error);
        return [];
    }
}


export function ObjectMap(obj: { [key: string]: any }, fn: (value: any) => any) {
    try {
        return Object.keys(obj)
                     .map(key => fn(obj[key]) );
    } catch (error) {
        console.error('Error in ObjectMap : ', error);
        return [];
    }   
}