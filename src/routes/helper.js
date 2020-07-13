/**
 * 取本地缓存
 * @param key
 */
function getStorage(key) {
	return localStorage.getItem(key);
}
/**
 * 设置本地缓存
 * @param key
 * @param value
 */
function setStorage(key, value) {
	localStorage.setItem(key, value);
}
exports = module.exports = {
	getStorage: getStorage,
	setStorage: setStorage
};