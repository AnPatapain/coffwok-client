const add = (key, value) => {
    localStorage.setItem(key, value)
}

const LocalStorageService = {
    add
}

export default LocalStorageService