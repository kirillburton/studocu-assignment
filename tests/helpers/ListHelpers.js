export function getChildElementLocator(parent, n) {
    return `${parent} :nth-child(${n})`;
}