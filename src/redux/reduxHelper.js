function _fetch(url, timeout) {
    var abort_fn = null;
    var fetch_promise = fetch(url);
    var abort_promise = new Promise(function(resolve, reject) {
        abort_fn = function() {
            reject({
                message: '网络超时'
            });
        };
    });
    var abortable_promise = Promise.race([fetch_promise, abort_promise]);
    setTimeout(function() {
        abort_fn();
    }, timeout);

    return abortable_promise;
}

exports = module.exports = {
    _fetch: _fetch
}