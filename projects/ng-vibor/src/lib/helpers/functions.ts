
export function IsNumber(n: any): boolean {
    return !isNaN(n) && n !== undefined && n !== null;
}

export function fetchFromObject(object: any, prop: string): any {
    if (typeof object === 'undefined') {
        return false;
    }
    if (typeof object === 'string') {
        return object;
    }

    const index: number = prop.indexOf('.');
    if (index > -1) {
        return fetchFromObject(object[prop.substring(0, index)], prop.substr(index + 1));
    }

    return object[prop];
}
