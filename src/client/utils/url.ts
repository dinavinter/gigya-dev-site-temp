export function getUrlParams() {
    const queryString = window.location.search;
    return  new URLSearchParams(queryString);
}