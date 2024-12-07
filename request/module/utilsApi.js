const request = require("../request");

module.exports = {
    GetImage(url, Image) {
        return request.getImage(url + Image);
    }
}
