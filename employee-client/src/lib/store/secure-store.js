
import secureLocalStorage from "react-secure-storage"

const setItem = (key, value) => {
    secureLocalStorage.setItem(key, value)
}

const getItem = (key) => {
    return secureLocalStorage.getItem(key)
}

const removeItem = (key) => {
    secureLocalStorage.removeItem(key)
}

const clearAll = () => {
    secureLocalStorage.clear()
}

const getList = (key) => {
    const tempData = secureLocalStorage.getItem(key)
    return tempData ? tempData : []
}

const SecureStorageService = {
    setItem,
    getItem,
    getList,
    removeItem,
    clearAll
}

export default SecureStorageService