/**
 * @file index
 * @author xiaozhihua
 * @date 2018-06-29 18:24:44
 */

const fs = require('fs')

class Storage {
    constructor(root) {
        this.root = root

        if (!this.has(this.root)) {
            this.root.split('/').map((item, index, list) => {
                const filePath = list.slice(0, index + 1).join('/')

                if (filePath && !this.has(filePath)) {
                    fs.mkdirSync(filePath)
                }
            })
        }
    }

    has(key) {
        return fs.existsSync(key)
    }

    set(key, data) {
        
    }

    get(key) {

    }

    getKeys() {

    }

    find(key) {

    }
}
