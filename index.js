/**
 * @file index
 * @author xiaozhihua
 * @date 2018-06-29 18:24:44
 */

const fs = require('fs')

class Storage {
    constructor(root) {
        this.root = root
        this.index = 0

        if (!fs.existsSync(this.root)) {
            this.root.split('/').map((item, index, list) => {
                const filePath = list.slice(0, index + 1).join('/')

                if (filePath && !fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                }
            })
        }
    }

    getId() {
        let random = `${Math.random() * Math.random()}`.slice(2, 8)
        let now = Date.now()
        
        this.index += 1
    
        return `${this.index}:${parseInt(`${now}${random}`, 10).toString(32)}`
    }

    has(key) {
        return fs.existsSync(`${this.root}/${key}`)
    }

    set(key, data) {
        return new Promise(resolve => {
            fs.writeFile(`${this.root}/${key}`, JSON.stringify(data), err => {
                if (err) {
                    resolve({
                        status: 'fail',
                        details: err
                    })
                }
                else {
                    resolve({
                        status: 'ok'
                    })
                }
            })
        })
    }

    get(key) {
        return new Promise(resolve => {
            fs.readFile(`${this.root}/${key}`, (err, res) => {
                if (err) {
                    resolve({
                        status: 'fail',
                        details: err
                    })
                }
                else {
                    resolve({
                        status: 'ok',
                        data: JSON.parse(res.toString())
                    })
                }
            })
        })
    }

    remove(key) {
        return new Promise(resolve => {
            fs.unlink(`${this.root}/${key}`, (err, res) => {
                if (err) {
                    resolve({
                        status: 'fail',
                        details: err
                    })
                }
                else {
                    resolve({
                        status: 'ok'
                    })
                }
            })
        })
    }

    getKeys() {
        return new Promise(resolve => {
            fs.readdir(this.root, (err, res) => {
                if (err) {
                    resolve({
                        status: 'fail',
                        details: err
                    })
                }
                else {
                    resolve({
                        status: 'ok',
                        data: res
                    })
                }
            })
        })
    }

    getAll() {
        return this.getKeys().then(async res => {
            if (res.status === 'ok') {
                return {
                    status: 'ok',
                    data: await Promise.all(res.data.map(key => {
                        return this.get(key).then(res => {
                            if (res.status === 'ok') {
                                return res.data
                            }
    
                            return null
                        })
                    }))
                }
            }

            return {
                status: 'fail',
                details: res.details
            }
        })
    }

    findKeys(regex) {
        return this.getKeys().then(res => {
            if (res.status === 'ok') {
                return {
                    status: 'ok',
                    data: res.data.filter(key => {
                        if (typeof regex === 'string') {
                            return key.indexOf(regex) > -1
                        }
                        else if (typeof regex === 'function') {
                            return regex(key)
                        }
                        
                        return regex.test(key)
                    })
                }
            }

            return {
                status: 'fail',
                details: res.details
            }
        })
    }
}

module.exports = Storage