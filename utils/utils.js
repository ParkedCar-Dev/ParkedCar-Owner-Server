module.exports = class Utils {
    static checkNullOrUndefined(array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == null || array[i] == undefined) {
                return true;
            }
        }
        return false;
    }
}