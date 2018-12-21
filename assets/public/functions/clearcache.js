function cacheRefresh() {
    request(window.location.pathname + window.location.search + ((window.location.search==='')?'?':'&') + 'clearcache=1', 'GET', null, function(){ window.location.reload(true); });
}
