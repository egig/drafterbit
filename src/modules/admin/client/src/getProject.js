// TODO validate projects
export default  function getProject() {
    if(typeof __DRAFTERBIT_CONFIG__.projectSlug !== "undefined") {
        return __DRAFTERBIT_CONFIG__.projectSlug;
    }

    return '_default';
}